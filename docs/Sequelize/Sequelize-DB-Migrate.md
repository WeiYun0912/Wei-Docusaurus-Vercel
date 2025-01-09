---
title: "[Node.js] Sequelize 安裝與使用指南"

keywords: [nodejs, sequelize, postgresql, orm]

description: Sequelize 安裝與使用指南，包含如何安裝、初始化專案、設定資料庫及進行資料庫遷移等。

author: WeiYun0912

og:title: Sequelize 安裝與使用指南

og:description: Sequelize 安裝與使用指南，包含如何安裝、初始化專案、設定資料庫及進行資料庫遷移等。
---

## 說明

記錄一下怎麼使用 sequelize-cli 的 migrate 功能

---

## 安裝

### 1. 安裝 Sequelize 和 CLI 工具

在專案中安裝 Sequelize 和 Sequelize CLI 工具，因為專案是用 pgsql 所以用 pg 來當範例：

```bash
npm install sequelize pg
```

```bash
npm install --save-dev sequelize-cli
```

---

## 初始化專案

### 1. 初始化 Sequelize 專案結構

使用 Sequelize CLI 初始化專案結構：

```bash
npx sequelize-cli init
```

執行後會產生以下結構：

```
project/
├── migrations/   # 資料庫遷移檔案
├── models/       # 資料表模型
└── config/       # 資料庫設定檔
```

### 2. 測試指令

初始化成功後，可以也可以來看一下有哪些指令能夠使用：

```bash
npx sequelize-cli --help
```

```
Sequelize CLI [Node: 20.14.0, CLI: 6.6.2, ORM: 6.36.0]

sequelize <command>

Commands:
  sequelize db:migrate                        Run pending migrations
  sequelize db:migrate:schema:timestamps:add  Update migration table to have timestamps
  sequelize db:migrate:status                 List the status of all migrations
  sequelize db:migrate:undo                   Reverts a migration
  sequelize db:migrate:undo:all               Revert all migrations ran
  sequelize db:seed                           Run specified seeder
  sequelize db:seed:undo                      Deletes data from the database
  sequelize db:seed:all                       Run every seeder
  sequelize db:seed:undo:all                  Deletes data from the database
  sequelize db:create                         Create database specified by configuration
  sequelize db:drop                           Drop database specified by configuration
  sequelize init                              Initializes project
  sequelize init:config                       Initializes configuration
  sequelize init:migrations                   Initializes migrations
  sequelize init:models                       Initializes models
  sequelize init:seeders                      Initializes seeders
  sequelize migration:generate                Generates a new migration file
  sequelize migration:create                  Generates a new migration file
  sequelize model:generate                    Generates a model and its migration
  sequelize model:create                      Generates a model and its migration
  sequelize seed:generate                     Generates a new seed file
  sequelize seed:create                       Generates a new seed file
```

---

## 設定資料庫

### 1. 編輯 `config/config.js`

在 `config` 資料夾新增 `config.js`，因為我是使用 `.env` 檔案中的環境變數來設定資料庫連線，所以需要新增這個檔案。

```javascript
require("dotenv").config({ path: `.env.${process.env.NODE_ENV || "development"}` });

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
    },
};
```

如果沒有這個需求的話只需要改原本的 `config.json` 就好了。

```json
{
    "development": {
        "username": "root",
        "password": null,
        "database": "database_development",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": "root",
        "password": null,
        "database": "database_production",
        "host": "127.0.0.1",
        "dialect": "mysql"
    }
}
```

### 2. 建立 `.env` 檔案 (如果你也是使用 .env)

在專案根目錄新增 `.env` 檔案，並填入資料庫相關設定：

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=example_db
DB_USER=example_user
DB_PWD=example_password
```

---

## 使用 Migration

### 1. 生成 Migration 檔案

現在就可以使用 CLI 來生成 migrate 的檔案了~

先來新增 `products` 範例資料表：

```bash
npx sequelize-cli migration:generate --name create-products
```

接著你應該會在 terminal 看到我們的新建立的 migrate 檔案 `20250108083117-create-products.js`

```
New migration was created at D:\workspace\achamp-ava\ava-backend-server\migrations\20250108083117-create-products.js
```

現在來編輯剛建立的 `migrations/<timestamp>-create-products.js`：

```javascript
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("products", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            stock: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("products");
    },
};
```

在 `migration` 中，`up` 和 `down` 是用來描述資料庫結構的改動與還原(rollback)的：

-   `up`：
    定義如何應用這次的改動。

    在這段程式碼中，up 方法用來建立一個名為 products 的資料表，並定義表中的欄位結構，例如 id、name 和 price 等。

    `up` 裡面的程式碼會在我們執行 `npx sequelize-cli db:migrate` 時被執行。

-   `down`：
    定義如何 rollback 這次的改動。

    在這段程式碼中，down 方法用來刪除 products 資料表，`將資料庫還原到執行這次 migration 之前的狀態。`

    `down` 裡面的程式碼會在執行 `npx sequelize-cli db:migrate:undo` 時被執行。

這樣的好處是我們可以輕鬆管理資料庫的資料表欄位結構，當需要撤銷某次變更或在不同環境中應用相同的結構時，就可以透過 cli 的方式來快速更新。

### 2. 執行資料庫遷移

現在使用 `db:migrate` 指令來執行 migrate 檔案：

```bash
npx sequelize-cli db:migrate
```

成功的話應該會看到以下訊息：

```
Loaded configuration file "config\config.js".
Using environment "dev".
== 20250108084758-create-products: migrating =======
== 20250108084758-create-products: migrated (0.163s)
```

實際查看資料庫後，可以看到 `products` 資料表已經建立成功了。

![](https://i.imgur.com/gWIWVBu.png)

我們也可以執行 `migrate:status` 來查看目前資料庫的 migrate 狀態：

```bash
npx sequelize-cli db:migrate:status
```

```
Loaded configuration file "config\config.js".
Using environment "dev".
up 20250108084758-create-products.js
```

有看到 `up` 的話就代表 migrate 成功了。

### 3. 新增資料表結構

如果我們想在 `products` 資料表中新增一個 `description` 欄位，可以再執行一次 `migration:generate` 指令：

```bash
npx sequelize-cli migration:generate --name add-description-to-products
```

編輯剛建立的 `migrations/<timestamp>-add-description-to-products.js`：

```javascript
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("products", "description", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },
    down: async (queryInterface) => {
        await queryInterface.removeColumn("products", "description");
    },
};
```

再次執行 `db:migrate` 指令：

```bash
npx sequelize-cli db:migrate
```

這次執行後，可以看到 `products` 資料表中已經新增了 `description` 欄位。

![](https://i.imgur.com/ayhrtSQ.png)

### 4. rollback 最新一次的 migrate

如果我們想 rollback 最新的 migrate，可以使用 `db:migrate:undo` 指令，這只會 rollback 最新一次的 migrate：

```bash
npx sequelize-cli db:migrate:undo
```

執行後，可以看到 `products` 資料表中已經移除了 `description` 欄位。

```
== 20250108090642-add-description-to-products: reverting =======
== 20250108090642-add-description-to-products: reverted (0.066s)
```

### 5. rollback 所有 migrate

如果我們想 rollback 所有 migrate，可以使用 `db:migrate:undo:all` 指令，這會 rollback 所有已經執行的 migrate：

```bash
npx sequelize-cli db:migrate:undo:all
```

### 6. 指定 rollback 的 migrate (TBD...)

## 其他

如果覺得要產生 migrate 檔案要輸入很長一段指令很麻煩，我們可以濃縮一下。

在 `package.json` 中新增一個 script：

```json
"scripts": {
    "migrate:generate": "npx sequelize-cli migration:generate --name"
}
```

這樣我們就可以使用 `npm run migrate:generate <name>` 來產生 migrate 檔案了。

```bash
npm run migrate:generate <name>
```

## 參考資料

-   [Sequelize CLI](https://sequelize.org/docs/v6/other-topics/migrations/)
