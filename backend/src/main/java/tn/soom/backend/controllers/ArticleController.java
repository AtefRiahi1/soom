package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.entities.Article;
import tn.soom.backend.services.ArticleService;
import tn.soom.backend.services.ModuleService;

import java.util.List;

@RestController
@RequestMapping("/articles")
public class ArticleController {
    @Autowired
    private ArticleService articleService;

    @PostMapping
    public ResponseEntity<Article> addArticle(@RequestBody Article article,
                                              @RequestParam Integer entrepriseId,
                                              @RequestParam String empEmail) {
        Article savedArticle = articleService.addArticle(article, entrepriseId, empEmail);
        return ResponseEntity.ok(savedArticle);
    }

    @GetMapping("/{entrepriseId}")
    public ResponseEntity<List<Article>> getArticlesByEntrepriseId(@PathVariable Integer entrepriseId) {
        List<Article> articles = articleService.getArticleByEntrepriseId(entrepriseId);
        return ResponseEntity.ok(articles);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Integer id,
                                                 @RequestBody Article updatedArticle) {
        Article article = articleService.updateArticle(id, updatedArticle);
        return ResponseEntity.ok(article);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Integer id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }
}
