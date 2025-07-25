const tokenAddress = "TU_DIRECCION_DEL_CONTRATO_AQUI";
const tokenDecimals = 18;
const tokenSymbol = "BIGY";

let web3;
let userAccount;

async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      userAccount = accounts[0];
      alert("Wallet conectada: " + userAccount);
    } catch (error) {
      console.error(error);
      alert("Error al conectar Wallet.");
    }
  } else {
    alert("MetaMask no detectado.");
  }
}

async function getBalance() {
  const contract = new web3.eth.Contract([
    {
      "constant": true,
      "inputs": [{"name": "_owner","type": "address"}],
      "name": "balanceOf",
      "outputs": [{"name": "balance","type": "uint256"}],
      "type": "function"
    }
  ], tokenAddress);

  const balance = await contract.methods.balanceOf(userAccount).call();
  const adjusted = balance / (10 ** tokenDecimals);
  document.getElementById("balance").innerText = `💎 Saldo BIGY: ${adjusted}`;
}

async function sendToken() {
  const to = prompt("¿A qué dirección deseas enviar BIGY?");
  const amount = prompt("¿Cuántos BIGY deseas enviar?");
  const contract = new web3.eth.Contract([
    {
      "constant": false,
      "inputs": [
        { "name": "_to", "type": "address" },
        { "name": "_value", "type": "uint256" }
      ],
      "name": "transfer",
      "outputs": [{ "name": "", "type": "bool" }],
      "type": "function"
    }
  ], tokenAddress);

  await contract.methods.transfer(to, web3.utils.toWei(amount, 'ether')).send({ from: userAccount });
  alert("Enviado con éxito.");
}
