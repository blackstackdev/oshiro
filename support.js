/* Local note preparation only. No sender, persistence or game-save access. */
(() => {
  const form=document.getElementById('note-form');
  if(!form)return;
  const status=document.getElementById('note-status');
  let url=null;
  const clean=value=>value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').trim();
  form.hidden=false;
  form.addEventListener('input',()=>{status.replaceChildren();if(url){URL.revokeObjectURL(url);url=null;}});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const happened=clean(form.elements.happened.value);
    if(happened.length<5){form.elements.happened.setCustomValidity('Please describe what happened in at least five characters.');form.elements.happened.reportValidity();form.elements.happened.addEventListener('input',()=>form.elements.happened.setCustomValidity(''),{once:true});return;}
    const expected=clean(form.elements.expected.value),device=clean(form.elements.device.value);
    const text=['ōshiro — support note','Prepared locally by the player. This file has not been sent.','','What happened:',happened,'','What I expected:',expected||'Not provided','','Device and game version:',device||'Not provided','', 'Please review this note before sharing it.'].join('\n');
    try{
      if(url)URL.revokeObjectURL(url);
      url=URL.createObjectURL(new Blob([text+'\n'],{type:'text/plain;charset=utf-8'}));
      const a=document.createElement('a');a.href=url;a.download='oshiro-support-note.txt';a.textContent='Download the note again';
      status.replaceChildren(document.createTextNode('Your note is ready. A download was requested; nothing was sent. '),a);
      a.click();
    }catch(error){status.textContent='The download could not be prepared here. Copy your text into a note on your device instead.';}
  });
  window.addEventListener('pagehide',()=>{if(url)URL.revokeObjectURL(url);form.reset();status.replaceChildren();});
})();
