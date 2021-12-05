const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function respositoryExists(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find( (repository) => {
    return repository.id === id
  })

  if (repository) {
    request.repository = repository;
    return next()
  }

  return response.status(404).json({
    error: "Repository not found"
  });

}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  return response.status(201).json(repository);
});

app.put("/repositories/:id", respositoryExists, (request, response) => {
  const { repository } = request;
  const { title, url, techs } = request.body;
  
  if (title) {
    repository.title = title
  }

  if(url) {
    repository.url = url
  }

  if(techs) {
    repository.techs = techs;
  }

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => {
    return repository.id === id
  });

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", respositoryExists,  (request, response) => {
  const { repository } = request;

  const likes = repository.likes++;

  return response.json(likes);
});

module.exports = app;
