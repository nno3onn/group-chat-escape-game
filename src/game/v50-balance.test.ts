import assert from 'node:assert/strict';
import {init, skipToBoundary, selectChoice} from './runtime.ts';

function ending(path: readonly string[]): string | null {
  let state = init();
  for (const id of path) {
    state=skipToBoundary(state);
    assert.equal(state.phase,'waiting_choice',`waiting for ${id}`);
    state=selectChoice(state,id);
  }
  state=skipToBoundary(state);
  assert.equal(state.phase,'completed');
  return state.endingId;
}

assert.equal(ending(['leave_menu_ch1_intro','reason_notification','quiet_ignore','ch4_polite','final_disappear']), 'E04','Established E04 route must still work');
assert.equal(ending(['intro_busy','leave_silent','reason_notification','quiet_stop','ch4_polite','final_disappear']), 'E04','Deliberate quiet action should also work');
assert.notEqual(ending(['intro_ignore','leave_silent','reason_silence','silent_continue','ch4_polite','final_disappear']), 'E04','Pure ignore should not be a silent escape');
assert.notEqual(ending(['intro_ignore','leave_silent','reason_notification','quiet_ignore','ch4_silence','final_disappear']), 'E04','Global silence spam should not clear E04');
console.log('v50 E04 balance regressions: PASS');
