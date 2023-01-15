import { Machine } from "../types/machineRequest";
import { SymbolRequest } from "../types/symbolRequest";

export const formatResponseData = (data: any): Machine[] => {
  const machines: Machine[] = Object.entries(data).map(
    (entry: [string, any]) => {
      return {
        machineName: entry[0],
        symbols: Object.entries(entry[1]).map((entryS: [string, any]) => {
          return { symbolName: entryS[0], numOfLocates: entryS[1] };
        }),
      };
    }
  );

  return orderMachines(machines);
};

const orderMachines = (machines: Machine[]): Machine[] => {
  return machines.sort((machineA: Machine, machineB: Machine) => {
    return machineA.machineName >= machineB.machineName ? 1 : -1;
  });
};

export const getMachinesBySymbol = (
  machinesRequests: Machine[],
  symbolName: string
): Machine[] => {
  return machinesRequests.filter((machineRequest: Machine) =>
    machineRequest.symbols.some(
      (symbolRequest: SymbolRequest) => symbolRequest.symbolName === symbolName
    )
  );
};

export const getSumQuantity = (
  machinesRequests: Machine[],
  symbolName: string
): number => {
  return machinesRequests.reduce(
    (quantitySum: number, currentMachine: Machine) => {
      const machineRequestedQuantity: number = getMachineedQuantity(
        currentMachine,
        symbolName
      );

      if (machineRequestedQuantity !== -1) {
        return quantitySum + machineRequestedQuantity;
      } else {
        return quantitySum;
      }
    },
    0
  );
};

const getMachineedQuantity = (machine: Machine, symbolName: string): number => {
  const currentMachineSymbol: SymbolRequest | undefined = machine.symbols.find(
    (symbol: SymbolRequest) => symbol.symbolName === symbolName
  );

  return currentMachineSymbol ? currentMachineSymbol.numOfLocates : -1;
};

export const locatesDivide = (
  machinesThatAsk: Machine[],
  symbolName: string,
  sumQuantity: number,
  dividedLocates: any
): any => {
  const average: number = sumQuantity / machinesThatAsk.length;
  let machinesLeft: Machine[] = [];
  let newQuantity: number = sumQuantity;

  machinesThatAsk.forEach((machine: Machine) => {
    const machineRequestedQuantity: number = getMachineedQuantity(
      machine,
      symbolName
    );

    if (
      machineRequestedQuantity !== -1 &&
      machineRequestedQuantity <= average
    ) {
      dividedLocates[machine.machineName] = {
        ...dividedLocates[machine.machineName],
        [symbolName]: machineRequestedQuantity,
      };

      newQuantity -= machineRequestedQuantity;
    } else {
      machinesLeft.push(machine);
    }
  });

  if (machinesLeft.length === machinesThatAsk.length) {
    machinesLeft.forEach((machine: Machine) => {
      dividedLocates[machine.machineName] = {
        ...dividedLocates[machine.machineName],
        [symbolName]: average,
      };
    });
    return dividedLocates;
  } else {
    return locatesDivide(machinesLeft, symbolName, newQuantity, dividedLocates);
  }
};
