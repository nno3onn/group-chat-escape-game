import assert from 'node:assert/strict';
import {init,skipToBoundary,selectChoice} from './runtime.ts';
import {story} from './story.ts';
const queue=[init()];const visited=new Set<string>();const endings=new Set<string>();let transitions=0;
while(queue.length){const s=queue.shift()!;const key=[s.story.nodeId,JSON.stringify(s.story.stats),[...s.story.flags].sort().join(',')].join('|');if(visited.has(key))continue;visited.add(key);if(visited.size>35000)throw Error('Too many states');const end=skipToBoundary(s);if(end.phase==='completed'){endings.add(end.endingId!);continue;}assert.equal(end.phase,'waiting_choice');for(const choice of story[end.story.nodeId].choices??[]){if(choice.id==='leave_cancel')continue;try{const next=selectChoice(end,choice.id);queue.push(next);transitions++;}catch(e){if(!(e instanceof Error&&e.message.startsWith('Locked choice')))throw e;}}}
assert.deepEqual([...endings].sort(),['E01','E02','E03','E04','E05','E06','E07']);console.log({result:'PASS',endings:[...endings].sort(),states:visited.size,transitions});
