import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SettingsPage } from './settings-page';

describe('settings page', () => {
  let fixture: ComponentFixture<SettingsPage>;
  let page: HTMLElement;

  beforeEach(async () => {
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
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
  }

  async function save(): Promise<void> {
    page.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    await fixture.whenStable();
  }

  it('shows linked errors on submit and does not accept empty fields', async () => {
    await type('#display-name', '');
    await type('#email', '');
    expect(page.querySelector('#email-error')).toBeNull();

    await save();

    expect(field('#display-name').getAttribute('aria-describedby')).toBe('display-name-error');
    expect(page.querySelector('#display-name-error')?.textContent).toContain('Enter a display name.');
    expect(field('#email').getAttribute('aria-invalid')).toBe('true');
    expect(page.querySelector('#email-error')?.textContent).toContain('Enter an email address.');
    expect(page.querySelector('[role="status"]')?.textContent?.trim()).toBe('');
  });

  it('rejects a whitespace-only name and a malformed email', async () => {
    await type('#display-name', '   ');
    await type('#email', 'not-an-email');
    await save();

    expect(page.querySelector('#display-name-error')).not.toBeNull();
    expect(page.querySelector('#email-error')?.textContent).toContain('Enter a valid email address.');
    expect(page.querySelector('[role="alert"]')?.textContent?.trim()).toBe('');
    expect(page.querySelector('[role="status"]')?.textContent?.trim()).toBe('');
  });

  it('blocks saving an email without a dotted domain and allows saving after correction', async () => {
    await type('#email', 'kevine@fggm');
    field('#email').dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(page.querySelector('[role="alert"]')?.textContent?.trim()).toBe('');
    await save();

    expect(page.querySelector('#email-error')).toBeNull();
    expect(page.querySelector('[role="alert"]')?.textContent).toContain('The email domain needs a dot');
    expect(page.querySelector('[role="status"]')?.textContent?.trim()).toBe('');

    await type('#email', 'kevine@example.com');
    expect(page.querySelector('[role="alert"]')?.textContent?.trim()).toBe('');
    await save();
    expect(page.querySelector('[role="status"]')?.textContent).toContain(
      'Your settings have been saved.',
    );
  });

  it('greets and accepts a Unicode display name, and clears stale confirmation on edit', async () => {
    const name = '山田 Élodie';
    await type('#display-name', name);
    await type('#email', 'reader@example.com');
    expect(page.querySelector('bdi')?.textContent).toBe(name);

    await save();

    expect(page.querySelectorAll('[role="status"] .notice')).toHaveLength(1);
    expect(page.querySelector('[role="status"]')?.textContent).toContain(
      'Your settings have been saved.',
    );
    expect(field('#display-name').value).toBe(name);
    expect(field('#email').value).toBe('reader@example.com');

    await type('#email', 'new@example.com');
    expect(page.querySelector('[role="status"]')?.textContent?.trim()).toBe('');
  });
});
