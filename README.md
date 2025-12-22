# UPOS Web SDK

Official lightweight Web SDK for UPOS payments. Seamlessly integrate checkout into any web application (React, Vue, Angular, or Vanilla JS).

## Ecosystem

Looking for other ways to integrate UPOS? Check out our other repositories:

- **[WooCommerce Plugin](https://github.com/upos-pay/woocommerce-gateway)** - Official UPOS payment gateway for WooCommerce.

## Installation

### NPM

```bash
npm install @upos-pay/web-sdk
# or
yarn add @upos-pay/web-sdk
```

### CDN

```html
<script type="module" src="https://esm.sh/@upos-pay/web-sdk"></script>
```

## Quick Start

### CDN / Vanilla JS

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://esm.sh/@upos-pay/web-sdk"></script>
</head>
<body>
  <upos-payment public-key="pk_test_xxx" id="payment"></upos-payment>

  <script type="module">
    const payment = document.getElementById('payment')

    payment.prepare = async (data) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const created = await response.json()
      return created // { token }
    }
  </script>
</body>
</html>
```

### React

```tsx
import { UposPayment } from '@upos-pay/web-sdk/react'
import type { PrepareCallback } from '@upos-pay/web-sdk'

function CheckoutPage() {
  const handlePrepare: PrepareCallback = async (data) => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data)
    })

    const created = await response.json()
    return created // { token }
  }

  return <UposPayment publicKey="pk_test_xxx" prepare={handlePrepare} />
}
```

**Available React Components:**

| Component | Web Component |
|-----------|---------------|
| `UposPayment` | `<upos-payment>` |
| `UposInput` | `<upos-input>` |
| `UposSelect` | `<upos-select>` |
| `UposButton` | `<upos-button>` |
| `UposRadio` | `<upos-radio>` |
| `UposRadioGroup` | `<upos-radio-group>` |
| `UposT` | `<upos-t>` |

### Vue

**vite.config.ts:**

```ts
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('upos-')
        }
      }
    })
  ]
})
```

**Component:**

```vue
<template>
  <upos-payment ref="payment" public-key="pk_test_xxx"></upos-payment>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import '@upos-pay/web-sdk'

const payment = ref(null)

onMounted(() => {
  if (payment.value) {
    payment.value.prepare = async (data) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      const created = await response.json()
      return created // { token }
    }
  }
})
</script>
```

### Angular

**app.module.ts:**

```typescript
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

**Component:**

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core'
import '@upos-pay/web-sdk'
import type { PaymentData } from '@upos-pay/web-sdk'

@Component({
  selector: 'app-checkout',
  template: '<upos-payment #payment public-key="pk_test_xxx"></upos-payment>'
})
export class CheckoutComponent implements AfterViewInit {
  @ViewChild('payment') payment!: ElementRef

  ngAfterViewInit() {
    this.payment.nativeElement.prepare = async (data: PaymentData) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      const created = await response.json()
      return created // { token }
    }
  }
}
```

| `PrepareCallback` | [`PrepareCallback`](src/types/index.ts#L35) | - | Callback to create payment intent, returns `{ token }` |

## Configuration

```html
<!-- Test environment -->
<upos-payment public-key="pk_test_xxx"></upos-payment>

<!-- Production environment -->
<upos-payment public-key="pk_live_xxx"></upos-payment>

<!-- Custom API host (overrides public-key environment detection) -->
<upos-payment public-key="pk_test_xxx" api-host="https://custom.api.com"></upos-payment>

<!-- Default payment method -->
<upos-payment public-key="pk_test_xxx" default-method="crypto_tron"></upos-payment>

<!-- Debug logging -->
<upos-payment public-key="pk_test_xxx" log-level="debug"></upos-payment>
```

## Customization

> **Live Examples**: Clone the repository and run `yarn dev` to view customization demos at `http://localhost:3000`

### Level 1: CSS Variables

```html
<style>
  upos-payment {
    --payment-bg: #f8f9fa;
    --payment-border: #dee2e6;
    --payment-padding: 24px;
    --button-primary-bg: #3b82f6;
    --button-primary-hover: #2563eb;
  }
</style>

<upos-payment public-key="pk_test_xxx"></upos-payment>
```

### Level 2: CSS Parts

```html
<style>
  upos-payment::part(container) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  upos-payment::part(submit-section) {
    padding-top: 24px;
  }
</style>

<upos-payment public-key="pk_test_xxx"></upos-payment>
```

### Level 3: Slots

```html
<upos-payment public-key="pk_test_xxx">
  <!-- Custom submit button -->
  <button slot="submit-button">Pay Now</button>

  <!-- Custom payment method label -->
  <span slot="option-crypto">🪙 Cryptocurrency</span>

  <!-- Custom error icon -->
  <span slot="error-icon">⚠️</span>
</upos-payment>
```

### Loading State

```html
<style>
  upos-payment[data-loading="true"] .my-button {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>

<upos-payment public-key="pk_test_xxx">
  <button slot="submit-button" class="my-button">Pay</button>
</upos-payment>
```

### Translation in Slots

Use `<upos-t>` for automatic translation in custom slot content:

```html
<upos-payment public-key="pk_test_xxx" locale="zh-TW">
  <button slot="submit-button">
    <upos-t key="payment.submit" />
  </button>

  <span slot="option-crypto">🪙 <upos-t key="payment.methods.stablecoin" /></span>
</upos-payment>
```

## API Reference

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `public-key` | `string` | - | Public key (`pk_live_*` for production, others for test) |
| `api-host` | `string` | - | Custom API host (overrides public-key detection) |
| `prepare` | [`PrepareCallback`](src/types/index.ts#L35) | - | Callback to create payment intent, returns `{ token }` |
| `log-level` | `'error' \| 'warn' \| 'info' \| 'debug'` | `'warn'` | Log level |
| `default-method` | [`PaymentMethodType`](src/types/index.ts#L1) | `'crypto_tron'` | Default payment method |
| `locale` | [`SupportedLocale`](src/i18n/types.ts) | `'en-US'` | UI language |
| `translations` | [`Partial<Translations>`](src/i18n/types.ts) | - | Custom translations (partial override) |

#### Custom Translations

Override specific translation keys while keeping other translations from the selected locale:

```typescript
const payment = document.querySelector('upos-payment')
payment.translations = {
  'payment.submit': 'Checkout Now',
  'payment.methods.stablecoin': 'USDT Payment'
}
```

See [`src/i18n/locales/en-US.ts`](src/i18n/locales/en-US.ts) for all available translation keys.

### Slots

| Slot | Description |
|------|-------------|
| `submit-button` | Custom submit button |
| `option-crypto` | Crypto payment method label |
| `error-icon` | Error message icon |
| `method-selector-override` | Replace entire payment method selector |
| `network-select` | Crypto network selector |
| `currency-select` | Crypto currency selector |

### CSS Parts

| Part | Description |
|------|-------------|
| `container` | Main container |
| `method-selector` | Payment method selector section |
| `payment-method-item` | Payment method item wrapper |
| `method-label` | Payment method label text wrapper |
| `payment-forms` | Payment forms container |
| `errors` | Error messages container |
| `error-item` | Individual error item |
| `submit-section` | Submit button section |

### CSS Variables

See component source files for available CSS variables:

| Component | Source |
|-----------|--------|
| Payment, Method Item, Error | [`src/components/upos-payment/styles.ts`](src/components/upos-payment/styles.ts) |
| Button, Spinner | [`src/components/ui/upos-button.ts`](src/components/ui/upos-button.ts) |
| Input, Label | [`src/components/ui/upos-input.ts`](src/components/ui/upos-input.ts) |
| Select | [`src/components/ui/upos-select.ts`](src/components/ui/upos-select.ts) |
| Radio | [`src/components/ui/upos-radio.ts`](src/components/ui/upos-radio.ts) |
| Radio Group | [`src/components/ui/upos-radio-group.ts`](src/components/ui/upos-radio-group.ts) |

### TypeScript Types

```typescript
import type {
  PaymentMethodType,
  PaymentData,
  CryptoTronData,
  PrepareResult,
  PrepareCallback
} from '@upos-pay/web-sdk'
```

See [`src/types/index.ts`](src/types/index.ts) for type definitions.
