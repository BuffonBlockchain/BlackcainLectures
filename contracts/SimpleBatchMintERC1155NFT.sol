// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleBatchMintERC1155NFT is ERC1155, Ownable {

    struct NFTData {
        string name;
        string collection;
        string metadata;
    }

    mapping(uint256 => NFTData) public nftData;

    uint256 private _currentTokenId = 0;

    constructor() ERC1155("https://example.com/") Ownable(msg.sender){}

    function mintBatchNFT(uint256 numTokens) external onlyOwner {
        require(numTokens > 0, "Must mint at least 1 token");

        uint256[] memory ids = new uint256[](numTokens);
        uint256[] memory amounts = new uint256[](numTokens);

        for (uint256 i = 0; i < numTokens; i++) {
            _currentTokenId++;
            ids[i] = _currentTokenId;
            amounts[i] = 1;

            nftData[_currentTokenId] = NFTData({
                name: "name",
                collection: "collection",
                metadata: "metadata"
            });
        }

        _mintBatch(owner(), ids, amounts, "");
    }

     // Minting Fungible tokens
    function mintFungibleTokens(uint256 id, uint256 amount) external onlyOwner {
        require(amount > 0, "Amount should be greater than 0");
        _mint(owner(), id, amount, "");
    }
}
