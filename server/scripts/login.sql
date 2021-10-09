--#login#

SELECT idusuario, idtipousuario, nome, email, senha, avatar, tokengoogle FROM usuario WHERE email = @email

--END#login#

--#cadastro#

INSERT INTO usuario (idtipousuario, nome, email, senha) VALUES (@idtipousuario, @nome, @email, @senha)

--END#cadastro#

--#validaEmail#

SELECT * FROM usuario WHERE email = @email

--END#validaEmail#

--#usuarioPorId#

SELECT * FROM usuario WHERE idusuario = @idusuario

--END#usuarioPorId#

--#alterarSenha#

UPDATE usuario SET senha = @novaSenha WHERE idusuario = @idusuario

--END#alterarSenha#
