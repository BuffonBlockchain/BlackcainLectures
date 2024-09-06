// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


/// @custom:security-contact security@gmail.com
contract MyToken is ERC20 {
   address private _owner;

   event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
   event TokensMinted(address indexed to, uint256 amount);
   event TokensBurned(address indexed from, uint256 amount);
  event TokensPurchased(address indexed buyer, uint256 amount);

   constructor() ERC20("MyToken", "MTK") {
       _owner = msg.sender;
       _mint(msg.sender, 777 * 10 ** decimals());
       emit OwnershipTransferred(address(0), _owner);
   }

   modifier onlyOwner() {
       require(msg.sender == _owner, "Not the contract owner");
       _;
   }

   function owner() public view returns (address) {
       return _owner;
   }

   function mint(address to, uint256 amount) public onlyOwner {
       _mint(to, amount);
       emit TokensMinted(to, amount);
   }

   function decimals() public view virtual override returns (uint8) {
       return 2;
   }

   function burn(uint256 amount) public {
       _burn(msg.sender, amount);
       emit TokensBurned(msg.sender, amount);
   }

  function buyTokens() public payable {
       require(msg.value > 0, "You must send ETH to buy tokens");

       uint256 tokenPrice = 2 ether;
       uint256 tokensToBuy = (msg.value * 10 ** decimals()) / tokenPrice;

       require(tokensToBuy > 0, "Not enough ETH to buy any tokens");

       _mint(msg.sender, tokensToBuy);
       emit TokensPurchased(msg.sender, tokensToBuy);
   }

   function withdraw() public onlyOwner {
       uint256 contractBalance = address(this).balance;
       require(contractBalance > 0, "No ETH to withdraw");
       payable(_owner).transfer(contractBalance);
   }


}
