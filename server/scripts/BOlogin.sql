--#login#

SELECT idusuario, idtipousuario, nome, email, senha, avatar, tokengoogle, confirmouemail FROM usuario WHERE email = @email AND idtipousuario = 2

--END#login#