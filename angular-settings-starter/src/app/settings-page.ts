import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-root",
  imports: [ReactiveFormsModule],
  templateUrl: "./settings-page.html",
  styleUrl: "./settings-page.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected readonly profileForm = this.formBuilder.group({
    displayName: [
      "Alex Morgan",
      [Validators.required, Validators.pattern(/\S/)],
    ],
    email: ["alex@example.com", [Validators.required, Validators.email]],
  });

  protected readonly displayName = this.profileForm.controls.displayName;
  protected readonly email = this.profileForm.controls.email;
  private readonly nameInput = toSignal(this.displayName.valueChanges, {
    initialValue: this.displayName.value,
  });

  protected readonly greetingName = computed(() => this.nameInput().trim());
  protected readonly saveNotice = signal("");
  protected readonly saveError = signal("");

  protected clearNotice(): void {
    this.saveNotice.set("");
    this.saveError.set("");
  }

  protected save(): void {
    this.clearNotice();

    // The demo's dotted-domain rule is checked only when saving.
    const emailDomain = this.email.value.slice(
      this.email.value.lastIndexOf("@") + 1,
    );
    const missingDomainDot = this.email.valid && !emailDomain.includes(".");

    if (this.profileForm.invalid || missingDomainDot) {
      this.profileForm.markAllAsTouched();
      if (missingDomainDot) {
        this.saveError.set(
          "Settings were not saved. The email domain needs a dot, as in example.com.",
        );
      }
      return;
    }

    // This demo accepts the current form values for this session only.
    this.profileForm.markAsPristine();
    this.saveNotice.set("Your settings have been saved.");
  }
}
