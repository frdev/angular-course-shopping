import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

@Component({
  selector: "app-recipe-edit",
  templateUrl: "./recipe-edit.component.html",
  styleUrls: ["./recipe-edit.component.css"],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  formRecipe: FormGroup;
  paramsSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
      this.editMode = !!this.id;
      this.initForm();
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) this.paramsSubscription.unsubscribe();
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

    const { name, imagePath, description, ingredients } =
      this.recipeService.getRecipe(this.id);

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

    !this.editMode
      ? this.recipeService.addRecipe(recipe)
      : this.recipeService.updateRecipe(recipe);
  }
}
