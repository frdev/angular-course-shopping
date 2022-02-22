import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { of, Subject } from "rxjs";
import { map, switchMap, takeUntil, tap } from "rxjs/operators";
import { AppState } from "src/app/store/app.reducer";
import { Recipe } from "../recipe.model";
import { RecipesAdd, RecipesUpdate } from "../store/recipe.actions";

@Component({
  selector: "app-recipe-edit",
  templateUrl: "./recipe-edit.component.html",
  styleUrls: ["./recipe-edit.component.css"],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  formRecipe: FormGroup;

  private $destroy: Subject<boolean> = new Subject<boolean>();
  private recipe: Recipe;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        takeUntil(this.$destroy),
        tap(({ id }) => {
          this.id = +id;
          this.editMode = !!this.id;
        }),
        switchMap(() =>
          this.editMode
            ? this.store.select("recipes").pipe(
                takeUntil(this.$destroy),
                map(({ recipes }) => recipes.find(({ id }) => id === this.id)),
                tap((recipe) => (this.recipe = recipe))
              )
            : of({})
        )
      )
      .subscribe(() => {
        this.initForm();
      });
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  get name() {
    return this.formRecipe.get("name");
  }

  get imagePath() {
    return this.formRecipe.get("imagePath");
  }

  get description() {
    return this.formRecipe.get("description");
  }

  get ingredientsControls() {
    return (<FormArray>this.formRecipe.get("ingredients")).controls;
  }

  private initForm() {
    const { name, imagePath, description, ingredients } = this.setValuesForm();

    this.formRecipe = this.formBuilder.group({
      name: new FormControl(name, [Validators.required]),
      imagePath: new FormControl(imagePath, [Validators.required]),
      description: new FormControl(description, [Validators.required]),
      ingredients,
    });
  }

  private setValuesForm(): {
    name: string;
    imagePath: string;
    description: string;
    ingredients: FormArray;
  } {
    if (!this.editMode)
      return {
        name: "",
        imagePath: "",
        description: "",
        ingredients: new FormArray([]),
      };

    const { name, imagePath, description, ingredients } = this.recipe;

    const formArrayIngredients = new FormArray(
      ingredients.map((ingredient) =>
        this.generateIngredientFormGroup({
          name: ingredient.name,
          amount: ingredient.amount,
        })
      )
    );

    return {
      name,
      imagePath,
      description,
      ingredients: formArrayIngredients,
    };
  }

  private generateIngredientFormGroup({ name = "", amount = null } = {}) {
    return new FormGroup({
      name: new FormControl(name, [Validators.required]),
      amount: new FormControl(amount, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
    });
  }

  onCancel() {
    this.router.navigate([".."], { relativeTo: this.route });
  }

  onAddIngredient() {
    (<FormArray>this.formRecipe.get("ingredients")).push(
      this.generateIngredientFormGroup()
    );
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.formRecipe.get("ingredients")).removeAt(index);
  }

  onDeleteAllIngredients() {
    (<FormArray>this.formRecipe.get("ingredients")).clear();
  }

  onSubmit() {
    const { name, imagePath, description, ingredients } = this.formRecipe.value;

    const recipe = new Recipe(
      this.id,
      name,
      description,
      imagePath,
      ingredients
    );

    const eventDispatch = !this.editMode ? RecipesAdd : RecipesUpdate;

    this.store.dispatch(eventDispatch({ recipe }));
  }
}
