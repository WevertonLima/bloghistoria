--#consultar#

SELECT                  
    idemail
    , nome
    , emailusuario
FROM 
    email
WHERE
    emailusuario = @emailusuario

--END#consultar#

--#adicionar#

INSERT INTO email
    (nome, emailusuario)
VALUES 
    (@nome, @emailusuario)

--END#adicionar#