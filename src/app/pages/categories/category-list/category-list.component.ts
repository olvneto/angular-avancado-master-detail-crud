import { Category } from './../shared/category.model';
import { CategoryService } from './../shared/category.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(
      categories => {
        this.categories = categories,
        error => "Erro ao listar as categorias!"
      }
    );
  }

  deleteCategory(category) {
    const mustDelete = confirm("Deseja realmente excluir este item?");
    if (mustDelete) {
      this.categoryService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(element => element !== category),
        error => alert("Erro ao tentar excluir a categoria!")
      );
    }
  }

}
