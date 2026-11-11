import { ComponentFixture, TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { SettingsPage } from "./settings-page";
import { TranslocoTestingModule } from "@jsverse/transloco";
import en from "../../public/i18n/en.json";
import fr from "../../public/i18n/fr.json";
import ja from "../../public/i18n/ja.json";

describe("settings page", () => {
  let fixture: ComponentFixture<SettingsPage>;
  let page: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        SettingsPage,
        TranslocoTestingModule.forRoot({
          langs: { en, fr, ja },
          translocoConfig: {
            availableLangs: ["en", "fr", "ja"],
            defaultLang: "en",
            reRenderOnLangChange: true,
          },
          preloadLangs: true,
        }),
      ],
    });

    fixture = TestBed.createComponent(SettingsPage);
    page = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  function field(id: string): HTMLInputElement {
    return page.querySelector<HTMLInputElement>(id)!;
  }

  async function type(id: string, value: string): Promise<void> {
    const input = field(id);
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await fixture.whenStable();
  }

  async function save(): Promise<void> {
    page.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    await fixture.whenStable();
  }

  it("shows linked errors on submit and does not accept empty fields", async () => {
    await type("#display-name", "");
    await type("#email", "");
    expect(page.querySelector("#email-error")).toBeNull();

    await save();

    expect(field("#display-name").getAttribute("aria-describedby")).toBe(
      "display-name-error display-name-help",
    );
    expect(page.querySelector("#display-name-error")?.textContent).toContain(
      en.settings.validation.displayNameRequired,
    );
    expect(field("#email").getAttribute("aria-invalid")).toBe("true");
    expect(page.querySelector("#email-error")?.textContent).toContain(
      en.settings.validation.emailRequired,
    );
    expect(page.querySelector('[role="status"]')?.textContent?.trim()).toBe("");
  });

  it("rejects a whitespace-only name and a malformed email", async () => {
    await type("#display-name", "   ");
    await type("#email", "not-an-email");
    await save();

    expect(page.querySelector("#display-name-error")).not.toBeNull();
    expect(page.querySelector("#email-error")?.textContent).toContain(
      en.settings.validation.emailInvalid,
    );
    expect(page.querySelector('[role="alert"]')?.textContent?.trim()).toBe("");
    expect(page.querySelector('[role="status"]')?.textContent?.trim()).toBe("");
  });

  it("blocks saving an email without a dotted domain and allows saving after correction", async () => {
    await type("#email", "kevine@fggm");
    field("#email").dispatchEvent(new Event("blur"));
    await fixture.whenStable();
    expect(page.querySelector('[role="alert"]')?.textContent?.trim()).toBe("");
    await save();

    expect(page.querySelector("#email-error")).toBeNull();
    expect(page.querySelector('[role="alert"]')?.textContent).toContain(
      en.settings.save.missingDomainDot,
    );
    expect(page.querySelector('[role="status"]')?.textContent?.trim()).toBe("");

    await type("#email", "kevine@example.com");
    expect(page.querySelector('[role="alert"]')?.textContent?.trim()).toBe("");
    await save();
    expect(page.querySelector('[role="status"]')?.textContent).toContain(
      en.settings.save.success,
    );
  });

  it("greets and accepts a Unicode display name, and clears stale confirmation on edit", async () => {
    const name = "山田 Élodie";
    await type("#display-name", name);
    await type("#email", "reader@example.com");
    expect(page.querySelector(".panel-heading p")?.textContent?.trim()).toBe(
      en.settings.greeting.replace("{{name}}", name),
    );

    await save();

    expect(page.querySelectorAll('[role="status"] .notice')).toHaveLength(1);
    expect(page.querySelector('[role="status"]')?.textContent).toContain(
      en.settings.save.success,
    );
    expect(field("#display-name").value).toBe(name);
    expect(field("#email").value).toBe("reader@example.com");

    await type("#email", "new@example.com");
    expect(page.querySelector('[role="status"]')?.textContent?.trim()).toBe("");
  });

  it("switches languages while preserving form values and updating visible messages", async () => {
    const name = "山田 Élodie";
    const email = "reader@example.com";

    await type("#display-name", name);
    await type("#email", email);
    await save();

    expect(
      page.querySelector('[role="status"] .notice')?.textContent?.trim(),
    ).toBe(en.settings.save.success);

    const selector = page.querySelector<HTMLSelectElement>("#language")!;
    const languages = [
      { code: "fr", messages: fr },
      { code: "ja", messages: ja },
    ];

    for (const { code, messages } of languages) {
      selector.value = code;
      selector.dispatchEvent(new Event("change", { bubbles: true }));
      await fixture.whenStable();

      expect(selector.value).toBe(code);
      expect(page.querySelector("h1")?.textContent?.trim()).toBe(
        messages.settings.title,
      );
      expect(page.querySelector(".panel-heading p")?.textContent?.trim()).toBe(
        messages.settings.greeting.replace("{{name}}", name),
      );
      expect(
        page.querySelector('[role="status"] .notice')?.textContent?.trim(),
      ).toBe(messages.settings.save.success);

      expect(field("#display-name").value).toBe(name);
      expect(field("#email").value).toBe(email);
      expect(document.title).toBe(messages.settings.title);
      expect(document.documentElement.lang).toBe(code);
    }

    selector.value = "en";
    selector.dispatchEvent(new Event("change", { bubbles: true }));
    await fixture.whenStable();
  });
});
