const fn=n=>{console.log(n)};function getCombinations(n,e){let o=[];return function e(t,i,s){if(0!==i){if(!(i<0))for(let o=s;o<n.length;o++)t.includes(n[o])||(t.push(n[o]),e(t,i-n[o],o+1),t.pop())}else o.push([...t])}([],e,0),Array.from(new Set(o.map(JSON.stringify)),JSON.parse)}
//# sourceMappingURL=main.js.map
