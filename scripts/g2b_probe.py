#!/usr/bin/env python3
"""Probe G2B bid base amount and preliminary price APIs.

The script intentionally never prints service keys. Provide keys via environment
variables or copied data.go.kr application-detail text files.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import socket
import sys
from dataclasses import dataclass
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen


API_HOSTS = {
    "g2b": "https://nopenapi.g2b.go.kr",
    "data": "https://apis.data.go.kr/1230000",
}

BUSINESS_ENDPOINTS = {
    "thng": {
        "label": "물품",
        "base": "/ad/BidPublicInfoService/getBidPblancListInfoThngBsisAmount",
        "open": "/as/ScsbidInfoService/getOpengResultListInfoThng",
        "prelim": "/as/ScsbidInfoService/getOpengResultListInfoThngPreparPcDetail",
    },
    "cnstwk": {
        "label": "공사",
        "base": "/ad/BidPublicInfoService/getBidPblancListInfoCnstwkBsisAmount",
        "open": "/as/ScsbidInfoService/getOpengResultListInfoCnstwk",
        "prelim": "/as/ScsbidInfoService/getOpengResultListInfoCnstwkPreparPcDetail",
    },
    "servc": {
        "label": "용역",
        "base": "/ad/BidPublicInfoService/getBidPblancListInfoServcBsisAmount",
        "open": "/as/ScsbidInfoService/getOpengResultListInfoServc",
        "prelim": "/as/ScsbidInfoService/getOpengResultListInfoServcPreparPcDetail",
    },
    "frgcpt": {
        "label": "외자",
        "base": None,
        "open": "/as/ScsbidInfoService/getOpengResultListInfoFrgcpt",
        "prelim": "/as/ScsbidInfoService/getOpengResultListInfoFrgcptPreparPcDetail",
    },
}

KEY_RE = re.compile(r"[A-Za-z0-9%+/_=-]{80,}")


@dataclass(frozen=True)
class BidCase:
    business: str
    bid_ntce_no: str
    bid_ntce_ord: str | None = None
    bid_clsfc_no: str | None = None
    rbid_no: str | None = None


def extract_key_from_file(path: str) -> str:
    text = open(path, encoding="utf-8").read()
    candidates = [
        match.group(0)
        for match in KEY_RE.finditer(text)
        if re.search(r"[A-Za-z]", match.group(0)) and re.search(r"\d", match.group(0))
    ]
    if not candidates:
        raise ValueError(f"No service key-like value found in {path}")

    encoded = [value for value in candidates if "%" in value]
    return encoded[0] if encoded else candidates[0]


def normalize_key(value: str) -> str:
    value = value.strip()
    if "%" in value:
        return value
    return quote(value, safe="")


def parse_case(value: str) -> BidCase:
    parts = value.split(":")
    if len(parts) < 2:
        raise argparse.ArgumentTypeError(
            "case format must be business:bidNtceNo[:bidNtceOrd[:bidClsfcNo[:rbidNo]]]"
        )

    business = normalize_business(parts[0])
    if business not in BUSINESS_ENDPOINTS:
        choices = ", ".join(BUSINESS_ENDPOINTS)
        raise argparse.ArgumentTypeError(f"unknown business {parts[0]!r}; choose {choices}")

    padded = parts + [None] * (5 - len(parts))
    return BidCase(
        business=business,
        bid_ntce_no=padded[1],
        bid_ntce_ord=padded[2] or None,
        bid_clsfc_no=padded[3] or None,
        rbid_no=padded[4] or None,
    )


def normalize_business(value: str) -> str:
    aliases = {
        "물품": "thng",
        "thng": "thng",
        "공사": "cnstwk",
        "cnstwk": "cnstwk",
        "용역": "servc",
        "servc": "servc",
        "외자": "frgcpt",
        "frgcpt": "frgcpt",
    }
    return aliases.get(value.strip().lower(), value.strip().lower())


def make_url(host: str, path: str, service_key: str, params: dict[str, str]) -> str:
    query = urlencode(params)
    return f"{host}{path}?serviceKey={service_key}&{query}"


def request_json(url: str, timeout: float) -> tuple[int | None, dict[str, Any] | None, str]:
    req = Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 g2b-probe/1.0",
        },
    )
    try:
        with urlopen(req, timeout=timeout) as response:
            body = response.read().decode("utf-8", errors="replace")
            status = response.status
    except HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        return exc.code, None, body
    except TimeoutError as exc:
        return None, None, f"timeout: {exc}"
    except socket.timeout as exc:
        return None, None, f"timeout: {exc}"
    except URLError as exc:
        return None, None, str(exc)

    try:
        return status, json.loads(body), body
    except json.JSONDecodeError:
        return status, None, body


def find_response(value: Any) -> dict[str, Any] | None:
    if isinstance(value, dict):
        if "header" in value or "body" in value:
            return value
        for item in value.values():
            found = find_response(item)
            if found:
                return found
    return None


def as_list(value: Any) -> list[dict[str, Any]]:
    if value is None:
        return []
    if isinstance(value, list):
        return [item for item in value if isinstance(item, dict)]
    if isinstance(value, dict):
        return [value]
    return []


def response_items(body: dict[str, Any]) -> list[dict[str, Any]]:
    items = body.get("items")
    if isinstance(items, dict):
        return as_list(items.get("item"))
    return as_list(items)


def summarize(name: str, status: int | None, payload: dict[str, Any] | None, raw: str) -> dict[str, Any]:
    response = find_response(payload) if payload else None
    header = response.get("header", {}) if response else {}
    body = response.get("body", {}) if response else {}
    items = response_items(body)

    sample = items[0] if items else {}
    return {
        "name": name,
        "status": status,
        "resultCode": header.get("resultCode"),
        "resultMsg": header.get("resultMsg"),
        "totalCount": body.get("totalCount"),
        "itemCount": len(items),
        "sample": compact_sample(sample),
        "rawPreview": None if response else raw[:160],
    }


def compact_sample(item: dict[str, Any]) -> dict[str, Any] | None:
    if not item:
        return None

    keys = [
        "bidNtceNo",
        "bidNtceOrd",
        "bidClsfcNo",
        "rbidNo",
        "rbidNtceNo",
        "bidNtceNm",
        "bssamt",
        "plnprc",
        "totRsrvtnPrceNum",
        "compnoRsrvtnPrceSno",
        "bsisPlnprc",
        "drwtYn",
        "drwtNum",
        "rsrvtnPrceFileExistnceYn",
        "rlOpengDt",
    ]
    return {key: item.get(key) for key in keys if item.get(key) not in (None, "")}


def base_params(case: BidCase, query_div: str, begin: str, end: str) -> dict[str, str]:
    params = {
        "pageNo": "1",
        "numOfRows": "50",
        "inqryDiv": query_div,
        "inqryBgnDt": begin,
        "inqryEndDt": end,
        "bidNtceNo": case.bid_ntce_no,
        "type": "json",
    }
    if case.bid_ntce_ord:
        params["bidNtceOrd"] = case.bid_ntce_ord
    if case.bid_clsfc_no:
        params["bidClsfcNo"] = case.bid_clsfc_no
    if case.rbid_no:
        params["rbidNo"] = case.rbid_no
    return params


def resolve_key(env_name: str, file_path: str | None) -> str:
    if file_path:
        return normalize_key(extract_key_from_file(file_path))

    value = os.getenv(env_name)
    if not value:
        raise ValueError(f"Missing {env_name}. Set it or pass the matching --*-key-file option.")
    return normalize_key(value)


def run(args: argparse.Namespace) -> int:
    bid_key = resolve_key("G2B_BID_SERVICE_KEY", args.bid_key_file)
    scsbid_key = resolve_key("G2B_SCSBID_SERVICE_KEY", args.scsbid_key_file)
    host = API_HOSTS[args.host]
    query_divs = [value.strip() for value in args.query_divs.split(",") if value.strip()]

    for case in args.case:
        endpoints = BUSINESS_ENDPOINTS[case.business]
        print(f"\n## {endpoints['label']} {case.bid_ntce_no}")

        for query_div in query_divs:
            print(f"\n### inqryDiv={query_div}")

            if endpoints["base"]:
                url = make_url(
                    host,
                    endpoints["base"],
                    bid_key,
                    base_params(case, query_div, args.begin, args.end),
                )
                status, payload, raw = request_json(url, args.timeout)
                print_summary(summarize("기초금액", status, payload, raw))
            else:
                print("- 기초금액: 외자는 입찰공고정보서비스 기초금액 전용 오퍼레이션 없음")

            open_url = make_url(
                host,
                endpoints["open"],
                scsbid_key,
                base_params(case, query_div, args.begin, args.end),
            )
            status, payload, raw = request_json(open_url, args.timeout)
            print_summary(summarize("개찰결과", status, payload, raw))

            prelim_url = make_url(
                host,
                endpoints["prelim"],
                scsbid_key,
                base_params(case, query_div, args.begin, args.end),
            )
            status, payload, raw = request_json(prelim_url, args.timeout)
            print_summary(summarize("예비가격상세", status, payload, raw))

    return 0


def print_summary(summary: dict[str, Any]) -> None:
    visible = {key: value for key, value in summary.items() if value not in (None, {}, [])}
    print(json.dumps(visible, ensure_ascii=False, indent=2))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Probe G2B base amount and preliminary price APIs without printing keys."
    )
    parser.add_argument(
        "--bid-key-file",
        help="Copied data.go.kr text for 조달청_나라장터 입찰공고정보서비스",
    )
    parser.add_argument(
        "--scsbid-key-file",
        help="Copied data.go.kr text for 조달청_나라장터 낙찰정보서비스",
    )
    parser.add_argument(
        "--host",
        choices=sorted(API_HOSTS),
        default="data",
        help="API gateway host to call. Default: data",
    )
    parser.add_argument("--begin", default="202001010000", help="조회시작일시")
    parser.add_argument("--end", default="202612312359", help="조회종료일시")
    parser.add_argument(
        "--query-divs",
        default="1",
        help="Comma-separated inqryDiv values to try. Default: 1",
    )
    parser.add_argument("--timeout", type=float, default=15.0)
    parser.add_argument(
        "--case",
        action="append",
        required=True,
        type=parse_case,
        help=(
            "business:bidNtceNo[:bidNtceOrd[:bidClsfcNo[:rbidNo]]]. "
            "business is thng/cnstwk/servc/frgcpt or 물품/공사/용역/외자."
        ),
    )
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        return run(args)
    except ValueError as exc:
        parser.error(str(exc))
    return 2


if __name__ == "__main__":
    sys.exit(main())
