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


--#removerTags#

DELETE FROM 
    noticiatag 
WHERE
    idnoticia = @idnoticia

--END#removerTags#

--#adicionarTagNoticia#

INSERT INTO noticiatag
    (idnoticia, idtag)
VALUES
    (@idnoticia, @idtag)

--END#adicionarTagNoticia#
