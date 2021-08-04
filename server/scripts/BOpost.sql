--#consultar#

SELECT
	n.idnoticia
    , n.titulo
    , n.capa
    , n.descricao
    , DATE_FORMAT(n.datapub, "%d/%m/%Y") as datapub
    , n.ativo
FROM 
	noticia as n
ORDER BY
	n.datapub DESC

--END#consultar#

--#obterPorId#

SELECT                 
    idnoticia
    , titulo
    , descricao
    , capa
    , conteudo
FROM 
    noticia
WHERE
    idnoticia = @idnoticia

--END#obterPorId#

--#inserir#

INSERT INTO noticia
    (idusuario, titulo, descricao, capa, conteudo, acessos)
VALUES (
    @idusuario, @titulo, @descricao, @capa, @conteudo, 0
)

--END#inserir#

--#atualizar#

UPDATE 
    noticia
SET 
    titulo = @titulo
    , descricao = @descricao
    , capa = @capa
    , conteudo = @conteudo
WHERE
    idnoticia = @idnoticia

--END#atualizar#

--#atualizarStatus#

UPDATE 
    noticia
SET 
    ativo = @ativo
WHERE
    idnoticia = @idnoticia

--END#atualizarStatus#

