import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  DOCUMENT,
  effect,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  TranslocoDirective,
  translateSignal,
  TranslocoService,
} from "@jsverse/transloco";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-root",
  imports: [ReactiveFormsModule, TranslocoDirective],
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
  protected readonly saveResult = signal<"success" | "missingDomainDot" | null>(
    null,
  );
  protected readonly saveSuccessMessage = translateSignal(
    "settings.save.success",
  );
  protected readonly missingDomainDotMessage = translateSignal(
    "settings.save.missingDomainDot",
  );
  private readonly transloco = inject(TranslocoService);
  private readonly document = inject(DOCUMENT);

  protected readonly activeLanguage = this.transloco.activeLang;
  private readonly title = inject(Title);
  private readonly pageTitle = translateSignal("settings.title");

  constructor() {
    effect(() => {
      this.document.documentElement.lang = this.activeLanguage();
    });
    effect(() => {
      const title = this.pageTitle();
      if (title) {
        this.title.setTitle(title);
      }
    });
  }

  protected changeLanguage(language: string): void {
    this.transloco.setActiveLang(language);
  }

  protected clearNotice(): void {
    this.saveResult.set(null);
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
        this.saveResult.set("missingDomainDot");
      }
      return;
    }

    // This demo accepts the current form values for this session only.
    this.profileForm.markAsPristine();
    this.saveResult.set("success");
  }
}
