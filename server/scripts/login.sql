--#login#

SELECT idusuario, idtipousuario, nome, email, senha, avatar, tokengoogle FROM usuario WHERE email = @email

--END#login#