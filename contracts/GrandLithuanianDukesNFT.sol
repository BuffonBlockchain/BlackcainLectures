// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing OpenZeppelin's ERC721 implementation and Ownable contract for managing ownership and access control
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Main contract inheriting from ERC721URIStorage (for NFTs with metadata URI) and Ownable (for ownership management)
contract GrandLithuanianDukesNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter; // Counter to keep track of the number of tokens minted
    string public baseURI; // Base URI for all metadata files

    // Constructor that initializes the contract and mints all NFTs
    constructor(string memory _baseURI) ERC721("Grand Dukes of Lithuania", "GDLNFT") Ownable(msg.sender) {
        baseURI = _baseURI; // Set the base URI for metadata
        tokenCounter = 0; // Initialize the token counter

        _mintAllNFTs(); // Mint all NFTs when the contract is deployed
    }

    /**
     * @dev Internal function to mint all NFTs upon deployment.
     * Only the owner (deployer) can execute this function.
     */
    function _mintAllNFTs() internal onlyOwner {
        // Array containing the filenames for each NFT's metadata JSON file
        string[21] memory metadataFiles = [
            "1_mindaugas.json", "2_treniota.json", "3_vaishvilkas.json",
            "4_shvarnas.json", "5_traidenis.json", "6_daumantas.json",
            "7_butigeidis.json", "8_butvydas.json", "9_vytenis.json",
            "10_gediminas.json", "11_jaunutis.json", "12_algirdas.json",
            "13_keystutis.json", "14_jogaila.json", "15_vytautas.json",
            "16_shvitrigaila.json", "17_jygimantas_keystutaitis.json",
            "18_kazimieras_jogailaitis.json", "19_aleksandras_jogailaitis.json",
            "20_jygimantas_senasis.json", "21_jygimantas_augustas.json"
        ];

        // Loop through each metadata file and mint an NFT for it
        for (uint256 i = 0; i < metadataFiles.length; i++) {
            _mintSingleNFT(metadataFiles[i]);
        }
    }

    /**
     * @dev Internal function to mint a single NFT with a specific metadata file.
     * @param metadataFile The name of the metadata file in the IPFS folder.
     * Only the owner can call this function.
     */
    function _mintSingleNFT(string memory metadataFile) internal onlyOwner {
        uint256 newTokenId = tokenCounter; // Assign a new token ID
        string memory tokenURI = string(abi.encodePacked(baseURI, metadataFile)); // Construct the full URI for the metadata

        _safeMint(msg.sender, newTokenId); // Safely mint the new NFT to the owner's address
        _setTokenURI(newTokenId, tokenURI); // Set the metadata URI for the newly minted NFT

        tokenCounter += 1; // Increment the token counter
    }
}
