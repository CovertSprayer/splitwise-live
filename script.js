class SplitwiseGraph{
  constructor(){
    this.adj = new Map();
  }

  addTransaction(person1, person2, amount){
    if(!this.adj.has(person1)){
      this.adj.set(person1, []);
    }

    this.adj.get(person1).push([person2, amount]);
  }

  calculateBalances(){
    const balances = new Map();
    for(let [person, transactions] of this.adj){
      transactions.forEach(([otherPerson, amount]) => {
        if(!balances.has(person)) balances.set(person, 0);
        if(!balances.has(otherPerson)) balances.set(otherPerson, 0);

        balances.set(person, balances.get(person) - amount);
        balances.set(otherPerson, balances.get(otherPerson) + amount)
        //person -> sub
        //otherPerson -> add
      });
    }

    return balances;
  }

  /**
   * balances: {
   *    rahul: -1500,
   *    shubham: 1400,
   *    mohan : 100
   * }
   */

  getSettlements(){
    const settlemets = [];
    const balances = this.calculateBalances();
    
    const payers = Array.from(balances).filter(([person, amount]) => amount < 0);
    const receivers = Array.from(balances).filter(([person, amount]) => amount > 0);

    payers.sort((a, b) => a[1] - b[1]);
    receivers.sort((a, b) => b[1] - a[1]);

    while(payers.length > 0 && receivers.length > 0){
      const payer = payers[0];
      const receiver = receivers[0];
      
      const settlementAmount = Math.min(-payer[1], receiver[1]);

      settlemets.push(`${payer[0]} has to pay ${settlementAmount} to ${receiver[0]}`);
      
      payers[0][1] += settlementAmount;
      receivers[0][1] -= settlementAmount;

      if(payers[0][1] === 0){
        payers.shift();
      }

      if(receivers[0][1] === 0){
        receivers.shift();
      }
    }

    return settlemets;
  }

  printAdj(){
    console.log(this.adj)
  }

}

const graph = new SplitwiseGraph();

// graph.addTransaction("rahul", "shubham", 1000);
// graph.addTransaction("rahul", "mohan", 500);
// graph.addTransaction("mohan", "shubham", 400);
// graph.printAdj();

// graph.addTransaction("a", "c", 500);
// graph.addTransaction("a", "d", 200);
// graph.addTransaction("d", "c", 100);
// graph.addTransaction("b", "c", 100);
// graph.addTransaction("b", "d", 400);

// const finalSettlements = graph.getSettlements();

// console.log(finalSettlements);

const payerInput = document.getElementById('payer');
const receiverInput = document.getElementById('receiver');
const amountInput = document.getElementById('amount');
const addTransactionButton = document.getElementById('add-transaction')
const transactionList = document.getElementById("transaction-list");
const settlementButton = document.getElementById("get-settlement");
const settlementList = document.getElementById("settlement-list");

addTransactionButton.addEventListener("click", () => {
  const payer = payerInput.value;
  const receiver = receiverInput.value;
  const amount = parseFloat(amountInput.value);

  if(payer && receiver && amount > 0){
    graph.addTransaction(payer, receiver, amount);

    const transactionItem = document.createElement('li');
    transactionItem.textContent = `${payer} owes ${receiver}: ₹${amount}`
    transactionList.appendChild(transactionItem);

    payerInput.value = "";
    receiverInput.value = ""
    amountInput.value = "";
  }
})

settlementButton.addEventListener("click", () => {
  const settlements = graph.getSettlements();
  
  settlements.forEach(settlement => {
    const settlementItem = document.createElement("li");
    settlementItem.textContent= settlement;
    settlementList.appendChild(settlementItem);
  });
})

