<!-- ---
title: 낙관적 업데이트에서의 순서제어
emoji: ''
date: '2023-11-20'
author: 이현진
tags: React
categories: 블로그
---

뱅크에서 우리팀 FE 개발자분들이 낙관적 업데이트를 했을 때 발생하는 문제에 대해서 토론하는 것을 듣고 낙관적 업데이트에서 발생할 수 있는 문제에 대해서 생각을 적어보았다.

먼저 서버에 mutation을 수행하기 전에 낙관적으로 UI를 업데이트하는 경우 아래 케이스를 고려해야한다.

- mutation 성공
- mutation 실패

![](https://github.com/hyunjinee/hyunjin/assets/63354527/1ca6ee78-76a1-4fba-ad00-2d911f5e230a) -->
