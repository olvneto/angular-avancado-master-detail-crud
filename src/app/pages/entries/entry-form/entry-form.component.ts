import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import toastr from 'toastr';

import { EntryService } from '../shared/entry.service';
import { Entry } from '../shared/entry.model';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Array<Category>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) { }


  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  submitForm() {
    if (this.currentAction === 'new') {
      this.createEntry();
    }
    else {
      this.updateEntry();
    }
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  private setCurrentAction(): void {
    if (this.route.snapshot.url[0].path == "new") {
      this.currentAction = "new";
    }
    else {
      this.currentAction = "edit";
    }
  }

  private buildEntryForm(): void {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ["expense",[Validators.required]],
      amount: [null,[Validators.required]],
      date: [null,[Validators.required]],
      paid: [true,[Validators.required]],
      categoryId: [null,[Validators.required]]
    });
  }

  private loadEntry(): void {
    if (this.currentAction == "edit") {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get("id")))
      )
        .subscribe(
          (entry) => {
            this.entry = entry,
              this.entryForm.patchValue(entry) // binds loaded entry data to EntryForm
          },
          (error) => alert('Ocorreu um erro no servidor, tente mais tarde!')
        );
    }
  }

  private setPageTitle(): void {
    if (this.currentAction == 'new') {
      this.pageTitle = "Cadastro de Novo Lançamento"
    }
    else {
      const entryName = this.entry.name || "";
      this.pageTitle = "Editando Lançamento: " + entryName;
    }
  }

  private loadCategories(){
    this.categoryService.getAll().subscribe(
      (categories) => this.categories = categories
    );
  }

  createEntry(): void {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.create(entry)
      .subscribe(
        entry => this.actionsForSuccess(entry),
        error => this.actionsForError(error)
      );
  }

  updateEntry(): void {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry)
    .subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    );
  }

  private actionsForSuccess(entry: Entry): void {
    toastr.success("Solicitação processada com sucesso!");

    this.router.navigateByUrl("entries", { skipLocationChange: true }).then(
      () => this.router.navigate(["entries", entry.id, "edit"])
    );
  }

  private actionsForError(error): void {
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");

    this.submittingForm = false;
    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    }
    else {
      this.serverErrorMessages = ["Falha na comunicação com o servidor!"]
    }
  }
}


