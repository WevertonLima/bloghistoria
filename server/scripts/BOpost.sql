--#consultar#

SELECT
	n.idnoticia
    , n.idcategoria
    , c.descricao as categoria
    , n.titulo
    , n.capa
    , n.descricao
    , DATE_FORMAT(n.datapub, "%d/%m/%Y") as datapub
    , n.ativo
    , n.acessos
    , (SELECT COUNT(*) FROM comentario WHERE idnoticia = n.idnoticia AND excluido = 0) as comentarios
    , (SELECT COUNT(*) FROM curtida WHERE idnoticia = n.idnoticia) as curtidas
FROM 
	noticia as n
    LEFT JOIN categoria as c ON c.idcategoria = n.idcategoria
ORDER BY
	n.datapub DESC

--END#consultar#

--#obterPorId#

SELECT                 
    idnoticia
    , idcategoria
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
    , idcategoria = @idcategoria
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

