//const{test,expect}= require("@playwright/test");

import { test, expect } from '@playwright/test';

test('Product Page Test', async ({ page }) => {
    // Go to the URL
    await page.goto('https://www.saucedemo.com/'); 

    //Enter Username
    await page.fill('//input[@id="user-name"]', 'standard_user');
    //Enter Password
    await page.fill('//input[@id="password"]','secret_sauce');

    //Click Login Button
    await page.click('//input[@id="login-button"]');

    //Verify the product page is displayed
    const textProduct = page.locator("//span[text()='Products']");
    await expect(textProduct).toBeVisible();

    //Sort the products by Price (high to low)
    await page.selectOption('//select[@class="product_sort_container"]', 'hilo');

    //Add the three cheapest products to your basket from UI.

    const products = await page.locator("//div[@class='inventory_item']").all();
    const productCount = products.length;
    console.log(`Count: ${products.length}`)


   for (let i = productCount - 3; i < productCount; i++) {
    const addButton = products[i].locator("//button[text()='Add to cart']");
    await addButton.click();
    const productPrice = await page.locator("(//div[@class='inventory_item_price'])").nth(i).textContent();
    console.log(`Product Price: ${productPrice}`);
  }

  //open the basket
    await page.click("//a[@class='shopping_cart_link']");

    //Verify the basket page is displayed
    const textBasket = page.locator("//span[text()='Your Cart']");
    await expect(textBasket).toBeVisible();

    //Remove the cheapest product from your basket
    const cartItems = await page.locator("//div[@class='cart_item']").all();
    let minPrice = Number.MAX_VALUE;

    let minIndex = 0;
    for (let i = 0; i < cartItems.length; i++) {
      const priceText = await cartItems[i].locator("//div[@class='inventory_item_price']").textContent()
      const price = parseFloat(priceText.replace("$", "")); // "19.99"
      console.log(`Price: ${price}`);
      if (price < minPrice) {
        minPrice = price;
        minIndex = i;
      }
    }
    await cartItems[minIndex].locator("//button[text()='Remove']").click();

    //Click on Checkout button
    await page.click("//button[@id='checkout']");
    //Verify the checkout page is displayed
    const textCheckout = page.locator("//span[text()='Checkout: Your Information']");
    await expect(textCheckout).toBeVisible();

    //Enter First Name
    await page.fill("//input[@id='first-name']", 'Pasan');
    //Enter Last Name
    await page.fill("//input[@id='last-name']", 'Basitha');
    //Enter Postal Code
    await page.fill("//input[@id='postal-code']", '123456');
    //Click Continue button
    await page.click("//input[@id='continue']");

    //Verify the overview page is displayed
    const textOverview = page.locator("//span[text()='Checkout: Overview']");
    await expect(textOverview).toBeVisible();
    //Click Finish button
    await page.click("//button[@id='finish']");

    //Verify the order success page is displayed
    const textOrderSuccess = page.locator("//h2[text()='Thank you for your order!']");
    await expect(textOrderSuccess).toBeVisible();

    page.close;
  
});