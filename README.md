# Repository for Student Work

This repository is intended for students to work on their projects. Each student should work in their own branch to avoid conflicts and overlap with other participants.

## Instructions for Working with the Repository

### 1. Cloning the Repository

First, clone the repository to your local computer:

git clone ssh://git@stash.scnsoft.com:2222/pd/blockchain-education-2024.git

### 2. Creating Your Branches

Each student should create two personal branches: **`master_surname`** — the main branch for "finalized" versions of your code, and **`develop_surname`** — a branch for active development and making changes.

#### Example of Creating Branches

For a student with the surname Kandrat:

git checkout -b master_kandrat  
git push origin master_kandrat  
git checkout -b develop_kandrat  
git push origin develop_kandrat

### 3. Working in the `develop_surname` Branch

All active development should be done in your `develop_surname` branch. After making changes, commit them and push to the remote repository:

### 4. Merging Changes into the `master_surname` Branch

When you have completed the work in the `develop_surname` branch, you can create PR the changes into your `master_surname` branch:

### 5. Rules for Working in the Repository

- **Work only in your branches**: Do not make changes to other students' branches or the main `master` branch.
- **Keep your code clean**: Before pushing changes, make sure your code is clean and meets formatting standards.

# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
