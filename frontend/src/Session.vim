let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd /sgoinfre/goinfre/Perso/eamar/2brains/frontend/src
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +1 index.tsx
badd +1 useless_file
badd +18 pages/Game/index.jsx
badd +31 pages/Social/components/chat/index.tsx
badd +1 components/Socket.tsx
badd +91 pages/Social/index.tsx
badd +10 pages/Game/index.tsx
badd +32 pages/Login/LoginForm.jsx
argglobal
%argdel
edit index.tsx
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
wincmd _ | wincmd |
vsplit
2wincmd h
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd w
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe '1resize ' . ((&lines * 13 + 19) / 38)
exe 'vert 1resize ' . ((&columns * 78 + 118) / 237)
exe '2resize ' . ((&lines * 21 + 19) / 38)
exe 'vert 2resize ' . ((&columns * 78 + 118) / 237)
exe '3resize ' . ((&lines * 5 + 19) / 38)
exe 'vert 3resize ' . ((&columns * 78 + 118) / 237)
exe '4resize ' . ((&lines * 29 + 19) / 38)
exe 'vert 4resize ' . ((&columns * 78 + 118) / 237)
exe 'vert 5resize ' . ((&columns * 79 + 118) / 237)
argglobal
balt useless_file
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 2 - ((0 * winheight(0) + 6) / 13)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 2
normal! 0
wincmd w
argglobal
if bufexists(fnamemodify("pages/Social/index.tsx", ":p")) | buffer pages/Social/index.tsx | else | edit pages/Social/index.tsx | endif
if &buftype ==# 'terminal'
  silent file pages/Social/index.tsx
endif
balt useless_file
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 20 - ((0 * winheight(0) + 10) / 21)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 20
normal! 050|
wincmd w
argglobal
if bufexists(fnamemodify("components/Socket.tsx", ":p")) | buffer components/Socket.tsx | else | edit components/Socket.tsx | endif
if &buftype ==# 'terminal'
  silent file components/Socket.tsx
endif
balt useless_file
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 6 - ((2 * winheight(0) + 2) / 5)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 6
normal! 0
wincmd w
argglobal
if bufexists(fnamemodify("pages/Social/components/chat/index.tsx", ":p")) | buffer pages/Social/components/chat/index.tsx | else | edit pages/Social/components/chat/index.tsx | endif
if &buftype ==# 'terminal'
  silent file pages/Social/components/chat/index.tsx
endif
balt useless_file
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 55 - ((14 * winheight(0) + 14) / 29)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 55
normal! 09|
wincmd w
argglobal
if bufexists(fnamemodify("pages/Game/index.jsx", ":p")) | buffer pages/Game/index.jsx | else | edit pages/Game/index.jsx | endif
if &buftype ==# 'terminal'
  silent file pages/Game/index.jsx
endif
balt useless_file
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 20 - ((19 * winheight(0) + 17) / 35)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 20
normal! 0
wincmd w
5wincmd w
exe '1resize ' . ((&lines * 13 + 19) / 38)
exe 'vert 1resize ' . ((&columns * 78 + 118) / 237)
exe '2resize ' . ((&lines * 21 + 19) / 38)
exe 'vert 2resize ' . ((&columns * 78 + 118) / 237)
exe '3resize ' . ((&lines * 5 + 19) / 38)
exe 'vert 3resize ' . ((&columns * 78 + 118) / 237)
exe '4resize ' . ((&lines * 29 + 19) / 38)
exe 'vert 4resize ' . ((&columns * 78 + 118) / 237)
exe 'vert 5resize ' . ((&columns * 79 + 118) / 237)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
