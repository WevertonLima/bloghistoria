
--#consultar#

SELECT                  
    idcategoria
    , descricao
    , ativo
    , destaque
FROM 
    categoria
ORDER BY 
    destaque DESC
    , descricao

--END#consultar#

--#obterPorId#

SELECT                 
    idcategoria
    , descricao
FROM 
    categoria
WHERE
    idcategoria = @idcategoria

--END#obterPorId#

--#inserir#

INSERT INTO categoria
    (descricao)
VALUES (
    @descricao
)

--END#inserir#

--#atualizar#

UPDATE 
    categoria
SET 
    descricao = @descricao
WHERE
    idcategoria = @idcategoria

--END#atualizar#

--#atualizarStatus#

UPDATE 
    categoria
SET 
    ativo = @ativo
WHERE
    idcategoria = @idcategoria

--END#atualizarStatus#

--#atualizarDestaque#

UPDATE 
    categoria
SET 
    destaque = @destaque
WHERE
    idcategoria = @idcategoria

--END#atualizarDestaque#