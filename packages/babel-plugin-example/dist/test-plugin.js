"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupJestTests = setupJestTests;
// 바벨 플러그인 테스트 방법 (TypeScript)
const babel = __importStar(require("@babel/core"));
const index_1 = __importDefault(require("./index"));
// 테스트할 코드
const inputCode = `
console.log('Hello');
console.error('Error');
const result = console.log('World');
`;
async function testPlugin() {
    try {
        // 플러그인 적용
        const output = babel.transformSync(inputCode, {
            plugins: [index_1.default],
            parserOpts: {
                sourceType: 'module',
                plugins: ['jsx', 'typescript'],
            },
        });
        if (!output || !output.code) {
            throw new Error('변환 실패');
        }
        console.log('원본 코드:');
        console.log(inputCode);
        console.log('\n변환된 코드:');
        console.log(output.code);
        // 결과 검증
        const expectedOutput = `myLogger.log('Hello');
console.error('Error');
const result = myLogger.log('World');`;
        if (output.code.trim() === expectedOutput.trim()) {
            console.log('\n✅ 테스트 통과!');
        }
        else {
            console.log('\n❌ 테스트 실패!');
            console.log('예상된 결과:');
            console.log(expectedOutput);
        }
    }
    catch (error) {
        console.error('테스트 중 오류 발생:', error);
    }
}
// Jest를 사용한 단위 테스트
function setupJestTests() {
    describe('console.log 변환 플러그인', () => {
        it('console.log를 myLogger.log로 변환해야 함', () => {
            const input = `console.log('test');`;
            const output = babel.transformSync(input, {
                plugins: [index_1.default],
            });
            expect(output?.code).toBe(`myLogger.log('test');`);
        });
        it('console.error는 변환하지 않아야 함', () => {
            const input = `console.error('error');`;
            const output = babel.transformSync(input, {
                plugins: [index_1.default],
            });
            expect(output?.code).toBe(`console.error('error');`);
        });
        it('중첩된 console.log도 변환해야 함', () => {
            const input = `
        function test() {
          console.log('nested');
        }
      `;
            const output = babel.transformSync(input, {
                plugins: [index_1.default],
            });
            expect(output?.code).toContain(`myLogger.log('nested');`);
        });
    });
}
// 테스트 실행
if (require.main === module) {
    testPlugin();
}
//# sourceMappingURL=test-plugin.js.map