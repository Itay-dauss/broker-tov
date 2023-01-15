import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { Machine } from "../types/machineRequest";
import { SymbolRequest } from "../types/symbolRequest";
import {
  formatResponseData,
  getMachinesBySymbol,
  getSumQuantity,
  locatesDivide,
} from "../utils/logic";
import {
  getMachinesRequests,
  getSessionId,
  getSymbolLocatesQantity,
  submitDivision,
} from "../utils/api";

const LocateRequests = () => {
  const [sessionId, setSessionId] = useState<number>(-1);
  const [locatesRequests, setLocatesRequests] = useState<Machine[]>([]);
  const [locatesDivision, setLocatesDivision] = useState<Machine[]>([]);
  const [isRequestedLoading, setIsRequestedLoading] = useState<boolean>(false);
  const [isDivisionLoading, setIsDivisionLoading] = useState<boolean>(false);

  useEffect(() => {
    // Create a new session when the component mounts

    const fetchSessionId = async () => {
      const sessionId: number = await getSessionId();
      setSessionId(sessionId);
    };

    fetchSessionId().catch((error) => console.error(error));
  }, []);

  const handleRequestClick = async () => {
    // Retrieve the locate requests when the button is clicked
    setIsRequestedLoading(true);
    const machinesRequests: any = await getMachinesRequests(sessionId);
    setLocatesRequests(formatResponseData(machinesRequests));
    setIsRequestedLoading(false);
  };

  const getLocatesFromBroker = async () => {
    setIsDivisionLoading(true);
    let fetchedSymbols: string[] = [];
    let dividedLocates: any = {};

    for (const machineRequests of locatesRequests) {
      for (const symbolRequest of machineRequests.symbols) {
        if (fetchedSymbols.includes(symbolRequest.symbolName)) continue;

        const machinesThatAsk: Machine[] = getMachinesBySymbol(
          locatesRequests,
          symbolRequest.symbolName
        );

        const sumQuantity: number = getSumQuantity(
          machinesThatAsk,
          symbolRequest.symbolName
        );

        const symbolLocates: any = await getSymbolLocatesQantity(sessionId, {
          symbolName: symbolRequest.symbolName,
          numOfLocates: sumQuantity,
        });

        dividedLocates = locatesDivide(
          machinesThatAsk,
          symbolRequest.symbolName,
          symbolLocates.quantity,
          dividedLocates
        );

        fetchedSymbols.push(symbolRequest.symbolName);
      }
    }
    await submitDivision(sessionId, dividedLocates);
    setLocatesDivision(formatResponseData(dividedLocates));
    setIsDivisionLoading(false);
  };

  const renderTableData = (
    machinesAndLocates: Machine[],
    isLoading: boolean
  ) => {
    return (
      <table>
        <thead>
          <tr>
            <th>Machine</th>
            <th>Symbol</th>
            <th>Locates</th>
          </tr>
        </thead>
        <tbody>
          {isLoading === true ? (
            <Spinner isVisible={isLoading} />
          ) : (
            machinesAndLocates.map((machineRequest: Machine) => (
              <div className="machine-symbols">
                {machineRequest.symbols.map((symbolRequest: SymbolRequest) => (
                  <tr>
                    <td>{machineRequest.machineName}</td>
                    <td>{symbolRequest.symbolName}</td>
                    <td>{Math.floor(symbolRequest.numOfLocates)}</td>
                  </tr>
                ))}
              </div>
            ))
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Broker Tov - Session ID: {sessionId}</h1>
      <button className="requested-button" onClick={handleRequestClick}>
        Retrieve Locate Requests
      </button>
      <div className="info-section">
        <div className="requests-section">
          {renderTableData(locatesRequests, isRequestedLoading)}
        </div>
        <div className="retrieve-locates-button-container">
          <button
            className="division-button"
            onClick={getLocatesFromBroker}
            disabled={locatesRequests.length === 0}
          >
            {"Fetch Locates and divide →"}
          </button>
        </div>
        <div className="division-results-section">
          {renderTableData(locatesDivision, isDivisionLoading)}
        </div>
      </div>
    </div>
  );
};

export default LocateRequests;
