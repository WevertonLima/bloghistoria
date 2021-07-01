--#consultar#

SELECT                  
    idemail
    , emailusuario
FROM 
    email
WHERE
    emailusuario = @emailusuario

--END#consultar#

--#adicionar#

INSERT INTO email
    (emailusuario)
VALUES 
    (@emailusuario)

--END#adicionar#