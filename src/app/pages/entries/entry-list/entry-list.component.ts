import { Entry } from './../shared/entry.model';
import { EntryService } from './../shared/entry.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.entryService.getAll().subscribe(
      entries => {
        this.entries = entries,
        error => "Erro ao listar as categorias!"
      }
    );
  }

  deleteEntry(entry) {
    const mustDelete = confirm("Deseja realmente excluir este item?");
    if (mustDelete) {
      this.entryService.delete(entry.id).subscribe(
        () => this.entries = this.entries.filter(element => element !== entry),
        error => alert("Erro ao tentar excluir a categoria!")
      );
    }
  }

}
