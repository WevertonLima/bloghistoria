--#consultar#

SELECT                  
    idsobre
    , descricaoautor
    , descricaoblog
FROM 
    sobre

--END#consultar#

--#atualizar#

UPDATE 
    sobre
SET 
    descricaoautor = @descricaoautor
    , descricaoblog = @descricaoblog
WHERE
    idsobre = @idsobre

--END#atualizar#