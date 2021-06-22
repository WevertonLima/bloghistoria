--#consultar#

SELECT                  
    idtag
    , descricao
    , ativo
FROM 
    tag
ORDER BY 
    descricao

--END#consultar#

--#obterPorId#

SELECT                 
    idtag
    , descricao
FROM 
    tag
WHERE
    idtag = @idtag

--END#obterPorId#

--#inserir#

INSERT INTO tag
    (descricao)
VALUES (
    @descricao
)

--END#inserir#

--#atualizar#

UPDATE 
    tag
SET 
    descricao = @descricao
WHERE
    idtag = @idtag

--END#atualizar#

--#atualizarStatus#

UPDATE 
    tag
SET 
    ativo = @ativo
WHERE
    idtag = @idtag

--END#atualizarStatus#

