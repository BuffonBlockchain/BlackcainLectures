// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing OpenZeppelin's ERC721 implementation and Ownable contract for managing ownership and access control
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Main contract inheriting from ERC721URIStorage (for NFTs with metadata URI) and Ownable (for ownership management)
contract GrandLithuanianDukesNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter; // Counter to keep track of the number of tokens minted
    string public baseURI; // Base URI for all metadata files

    // Define a structure to store metadata and price information for each NFT
    struct NFTInfo {
        string metadataFile; // Filename of the metadata JSON
        uint256 price; // Price of the NFT in wei
    }

    // Array to store NFT information
    NFTInfo[] public nfts; // An array to store all NFT metadata and price information

    // Constructor that initializes the contract and mints all NFTs
    constructor(string memory _baseURI) ERC721("Grand Dukes of Lithuania", "GDLNFT") Ownable(msg.sender) {
        baseURI = _baseURI; // Set the base URI for metadata
        tokenCounter = 0; // Initialize the token counter

        _initializeNFTs(); // Initialize NFTs with metadata and prices
        _mintAllNFTs(); // Mint all NFTs when the contract is deployed
    }

    /**
     * @dev Function to initialize NFTs with their metadata filenames and prices.
     * Adds the NFT information to the `nfts` array.
     */
    function _initializeNFTs() internal {
        nfts.push(NFTInfo("1_mindaugas.json", 850000000000000000)); // 1 міндоўг: 0.85 native token (in wei)
        nfts.push(NFTInfo("2_treniota.json", 100000000000000000)); // 2 Транята: 0.10 native token (in wei)
        nfts.push(NFTInfo("3_vaishvilkas.json", 650000000000000000)); // 3 войшалк: 0.65 native token (in wei)
        nfts.push(NFTInfo("4_shvarnas.json", 300000000000000000)); // 4 Шварн: 0.30 native token (in wei)
        nfts.push(NFTInfo("5_traidenis.json", 600000000000000000)); // 5 Трайдзень: 0.60 native token (in wei)
        nfts.push(NFTInfo("6_daumantas.json", 100000000000000000)); // 6 даўмонт: 0.10 native token (in wei)
        nfts.push(NFTInfo("7_butigeidis.json", 100000000000000000)); // 7 будзікід: 0.10 native token (in wei)
        nfts.push(NFTInfo("8_butvydas.json", 100000000000000000)); // 8 будзівід: 0.10 native token (in wei)
        nfts.push(NFTInfo("9_vytenis.json", 600000000000000000)); // 9 віцень: 0.60 native token (in wei)
        nfts.push(NFTInfo("10_gediminas.json", 770000000000000000)); // 10 гедымін: 0.77 native token (in wei)
        nfts.push(NFTInfo("11_jaunutis.json", 60000000000000000)); // 11 яўнут: 0.06 native token (in wei)
        nfts.push(NFTInfo("12_algirdas.json", 760000000000000000)); // 12 альгерд: 0.76 native token (in wei)
        nfts.push(NFTInfo("13_keystutis.json", 690000000000000000)); // 13 кейстут: 0.69 native token (in wei)
        nfts.push(NFTInfo("14_jogaila.json", 960000000000000000)); // 14 ягайла: 0.96 native token (in wei)
        nfts.push(NFTInfo("15_vytautas.json", 710000000000000000)); // 15 вітаўт: 0.71 native token (in wei)
        nfts.push(NFTInfo("16_shvitrigaila.json", 290000000000000000)); // 16 свідрыгайла: 0.29 native token (in wei)
        nfts.push(NFTInfo("17_jygimantas_keystutaitis.json", 510000000000000000)); // 17 жыгімонт кейстутавіч: 0.51 native token (in wei)
        nfts.push(NFTInfo("18_kazimieras_jogailaitis.json", 670000000000000000)); // 18 казімір: 0.67 native token (in wei)
        nfts.push(NFTInfo("19_aleksandras_jogailaitis.json", 640000000000000000)); // 19 аляксандр: 0.64 native token (in wei)
        nfts.push(NFTInfo("20_jygimantas_senasis.json", 770000000000000000)); // 20 жыгімонт стары: 0.77 native token (in wei)
        nfts.push(NFTInfo("21_jygimantas_augustas.json", 680000000000000000)); // 21 жыгімонт аўгуст: 0.68 native token (in wei)
    }

    /**
     * @dev Internal function to mint all NFTs upon deployment.
     * Only the owner (deployer) can execute this function.
     */
    function _mintAllNFTs() internal onlyOwner {
        for (uint256 i = 0; i < nfts.length; i++) {
            _mintSingleNFT(i); // Mint NFTs using the new data structure
        }
    }

    /**
     * @dev Internal function to mint a single NFT with a specific metadata file.
     * @param tokenId The ID of the NFT to mint.
     * Only the owner can call this function.
     */
    function _mintSingleNFT(uint256 tokenId) internal onlyOwner {
        string memory tokenURI = string(abi.encodePacked(baseURI, nfts[tokenId].metadataFile)); // Construct the full URI for the metadata

        _safeMint(msg.sender, tokenId); // Safely mint the new NFT to the owner's address
        _setTokenURI(tokenId, tokenURI); // Set the metadata URI for the newly minted NFT

        tokenCounter += 1; // Increment the token counter
    }

    /**
     * @dev Function to allow users to purchase a specific NFT by token ID.
     * Requires sending the correct amount of native token (in wei) based on the token's price.
     * @param tokenId The ID of the NFT to purchase.
     */
    function purchaseNFT(uint256 tokenId) external payable {
        require(tokenId < nfts.length, "Invalid token ID"); // Check if the token ID exists
        require(msg.value == nfts[tokenId].price, "Incorrect native token value sent."); // Ensure the sent value matches the price of the token
        require(ownerOf(tokenId) == owner(), "NFT already purchased."); // Ensure the token has not already been purchased (owned by the contract owner)

        // Transfer NFT to the buyer
        _safeTransfer(owner(), msg.sender, tokenId, ""); // Safely transfer the token from the contract owner to the buyer
    }

    /**
     * @dev Function to allow the owner to withdraw all native tokens from the contract.
     * Can only be called by the owner of the contract.
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance; // Get the current contract balance
        require(balance > 0, "No native token to withdraw."); // Check if there are funds to withdraw

        payable(owner()).transfer(balance); // Transfer all the funds to the contract owner
    }
}
