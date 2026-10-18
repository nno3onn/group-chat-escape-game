import {story,initialState,choose,normalize,available,type State} from './story.ts';
const errors:string[]=[];
const ids=new Set<string>();
for(const n of Object.values(story)){
 if(ids.has(n.id))errors.push(`duplicate ${n.id}`);ids.add(n.id);
 if(n.choices?.length&&n.nextNodeId)errors.push(`both choices and auto ${n.id}`);
 if(!n.choices?.length&&!n.nextNodeId&&!n.endingId)errors.push(`dead end ${n.id}`);
 for(const target of [n.nextNodeId,...(n.choices??[]).map(c=>c.nextNodeId)])if(target&&!story[target])errors.push(`missing ${n.id} -> ${target}`);
 for(const c of n.choices??[])if(c.when?.some(x=>x.flag&&x.stat))errors.push(`ambiguous condition ${c.id}`);
}
const results=new Map<string,string[]>();const visited=new Set<string>();const stack:[State,number][]=[[normalize(initialState),0]];
while(stack.length){const [s,depth]=stack.pop()!;const key=[s.nodeId,...Object.entries(s.stats).map(([k,v])=>`${k}:${v}`),...s.flags.slice().sort()].join('|');if(visited.has(key))continue;visited.add(key);if(depth>14){errors.push(`too deep ${s.nodeId}`);continue;}
 const n=story[s.nodeId];if(n.endingId){if(!results.has(n.endingId))results.set(n.endingId,s.history);continue;}
 for(const c of n.choices??[]){if(!available(c,s))continue;const next=normalize(choose(s,c.id));stack.push([next,depth+1]);}
}
for(const id of ['E01','E02','E03','E04','E05','E06','E07'])if(!results.has(id))errors.push(`unreachable ${id}`);
console.log(JSON.stringify({nodes:Object.keys(story).length,reachableEndings:[...results.keys()].sort(),visitedStates:visited.size,examplePaths:Object.fromEntries([...results].sort()),errors},null,2));
if(errors.length)process.exitCode=1;
