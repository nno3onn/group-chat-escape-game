from pathlib import Path
import json
import sys

root = Path(__file__).resolve().parent
project = Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path.cwd()
story_file = project / 'src/game/story.ts'
pkg_file = project / 'package.json'
if not story_file.exists() or not pkg_file.exists():
    sys.exit('오류: 프로젝트 루트에서 실행하거나 프로젝트 경로를 인자로 전달하세요.')
original = "mem.silence>=2 && mem.boundary>=1 && mem.junhoSupport>=1 && state.history.some(x=>['silent_continue','quiet_ignore'].includes(x)) && state.history.some(x=>['vote_later','vote_ask_subin','reason_permission','quiet_permission','ch4_polite'].includes(x)) && !state.history.includes('ch4_silence') && state.stats.escapeAttempts<=1"
replacement = "mem.silence>=2 && mem.boundary>=1 && mem.junhoSupport>=1 && state.history.includes('reason_notification') && state.history.some(x=>['quiet_ignore','quiet_stop'].includes(x)) && state.history.includes('ch4_polite') && !state.history.includes('ch4_silence') && state.stats.escapeAttempts<=1"
text = story_file.read_text(encoding='utf-8')
if replacement in text:
    print('스토리: 이미 v50 적용됨')
elif text.count(original) != 1:
    sys.exit('안전 중단: E04 판정 코드가 예상 버전과 달라요. 기존 파일은 수정하지 않았어요.')
else:
    story_file.write_text(text.replace(original,replacement),encoding='utf-8')
    print('스토리: E04 판정 조건 갱신')

script = 'src/game/v50-balance.test.ts'
test_src=(root/script).read_text(encoding='utf-8')
test_dst=project/script
test_dst.parent.mkdir(parents=True,exist_ok=True)
test_dst.write_text(test_src,encoding='utf-8')
pkg = json.loads(pkg_file.read_text(encoding='utf-8'))
cmd=pkg['scripts'].get('test:offline','')
token='node --experimental-strip-types src/game/v50-balance.test.ts'
if token not in cmd:
    if not cmd:sys.exit('오류: test:offline 스크립트가 없어요')
    pkg['scripts']['test:offline']=cmd+' && '+token
    pkg_file.write_text(json.dumps(pkg,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('테스트: v50 회귀 테스트 추가')
print('적용 완료. npm run test:offline && npm run check && npm run test:e2e 실행해 주세요.')
