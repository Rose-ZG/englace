'use strict';
function alive(win){return Boolean(win&&!win.isDestroyed());}
function contents(win){return alive(win)?win.webContents:null;}
function visible(win){return alive(win)&&win.isVisible();}
function show(win){if(!alive(win))return false;if(win.isMinimized())win.restore();win.show();win.focus();return true;}
function setVisible(win,value){if(!alive(win))return false;if(value)win.showInactive();else win.hide();return true;}
function toggle(win){return setVisible(win,!visible(win));}
module.exports={alive,contents,visible,show,setVisible,toggle};
