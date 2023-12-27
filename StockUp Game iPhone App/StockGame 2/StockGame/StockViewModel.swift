//
//  StockViewModel.swift
//  StockGame
//
//  Created by Cade Harger on 8/7/20.
//  Copyright © 2020 Cade Harger. All rights reserved.
//
//Version 1.0:
//First prototype
//
//Version 1.01:
//Fixed and issue where certain stocks would cause the app to crash, adjusted a few layout inconsistencies,
//fixed a bug where going over the number of days in data would cause the app to crash, clarified a few things
//in the how to play section, removed personal info from the about/help section
//
//Version 1.02:
//Fixed a few more layout inconsistencies, made animations look better, added version info, made ready for approval process
//
//Version 1.03:
//Fixed Dynamic Type text Bugs, Fixed more layout inconsistencies, added trade indicators to the graph, added popup informing users how to play, various bug fixes
//
//
//
//
//
//

import SwiftUI

class StockViewModel: ObservableObject {

    @Published private var stockModel: StockModel<Array<String>> = StockModel()
    
    
    init() {
        //stockModel.resetAllStocks()
        
        let index = Calendar.current.component(.weekday, from: Date())
        let weekday = Calendar.current.weekdaySymbols[index - 1]
        isWeekend = weekday == "Saturday" || weekday == "Sunday"
        
        updateStocks()
        if !isWeekend && retrieveTime(index: refreshIndex) != 5.0 {
            timer = Timer.scheduledTimer(timeInterval: retrieveTime(index: refreshIndex), target: self, selector: #selector(fireTimer), userInfo: nil, repeats: true)
        } else {
            print("Its the weekend.")
        }
        
        graphTimer = Timer.scheduledTimer(timeInterval: 60, target: self, selector: #selector(fireGraphTimer), userInfo: nil, repeats: true)
        graphTimer!.invalidate() 
    }
    
    var timer: Timer?
    
    var isWeekend: Bool
    
    var defaults: UserDefaults = UserDefaults.standard
    
    var refreshIndex: Int {
        get {
            if let data = defaults.value(forKey:"refreshIndex") as? Int {
                return data
            } else {
                return 0
            }
        }
        set {
            defaults.set(newValue, forKey:"refreshIndex")
        }
    }
    
    func retrieveTime(index: Int) -> Double {
        if index == 0 {
            return 30.0
        } else if index == 1 {
            return 60.0
        } else if index == 2 {
            return 120.0
        } else if index == 3 {
            return 300.0
        } else if index == 4 {
            return 600.0
        } else {
            return 5.0
        }
    }
    
    @objc func fireTimer(timer: Timer) {
        print("Timer fired!")
        updateStocks()
    }
            
    //MARK: Access to the model
    var slots: Array<StockModel<Array<String>>.Slot> {
        stockModel.slots
    }
    
    var stats: Array<String> {
        stockModel.calculateStats()
    }
    
    var errorState: String {
        stockModel.errorState
    }
    
    //MARK: Intents
    
    func updateTimer(index: Int) {
        refreshIndex = index
        if !isWeekend {
            let time = retrieveTime(index: index)
            print("refresh time index:", index)
            timer?.invalidate()
            if time != 5.0 {
                timer = Timer.scheduledTimer(timeInterval: time, target: self, selector: #selector(fireTimer), userInfo: nil, repeats: true)
            }
        }
    }
    
    func toggleError() {
        stockModel.updateErrorState("")
    }
    
    func makeAdvanced(slot: StockModel<Array<String>>.Slot) {
        stockModel.makeAdvanced(slot: slot)
    }
    
    func resetAllStocks() {
        stockModel.resetAllStocks()
    }
    
    func updateStocks() {
        for i in 0..<slots.count {
            let ticker = slots[i].content[0]
            let myURLString = "https://finance.yahoo.com/quote/\(ticker)?p=\(ticker)"
            guard let myURL = URL(string: myURLString) else {
                print("Error: \(myURLString) doesn't seem to be a valid URL")
                stockModel.removeSlot(i)
                return
            }
            
            DispatchQueue.global(qos: .userInitiated).async {
                if let myHTMLString = try? String(contentsOf: myURL, encoding: .ascii) {
                    var result = self.stockModel.infoFromSource(ticker: ticker, source: myHTMLString, positionType: self.slots[i].content[4], sharesHeld: self.slots[i].content[5], buyPrice: Int(Double(self.slots[i].content[9])! * 100.0), buyDate: self.slots[i].content[11])
                    DispatchQueue.main.async {
                        if result.count == 1 {
                            self.stockModel.updateErrorState(result[0])
                            result = self.stockModel.errorReturnArray //collects errors from infoFromSource
                        } else {
                            self.stockModel.updateStock(at: i, with: result)
                        }
                    }
                }
            }
        }
        print("stocks updated")
    }
    
    func addNewStock(ticker: String, positionType: String, shares: Int) {
        if shares >= 0 {
            if positionType == "End Position" {
                //self.updateStocks()
                self.stockModel.addNewStock(ticker: ticker, positionType: positionType, shares: shares)
            } else {
                let myURLString = "https://finance.yahoo.com/quote/\(ticker)?p=\(ticker)"
                guard let myURL = URL(string: myURLString) else {
                    print("Error: \(myURLString) doesn't seem to be a valid URL")
                    return
                }
                
                DispatchQueue.global(qos: .userInitiated).async {
                    if let myHTMLString = try? String(contentsOf: myURL, encoding: .ascii) {
                        var result = self.stockModel.infoFromSource(ticker: ticker, source: myHTMLString, positionType: positionType, sharesHeld: String(shares), buyPrice: -1, buyDate: "")
                        DispatchQueue.main.async {
                            if result.count == 1 {
                                self.stockModel.updateErrorState(result[0])
                                result = self.stockModel.errorReturnArray //collects errors from infoFromSource
                            } else {
                                if self.stockModel.isAffordable(slot: result) {
                                    // check if you have the money, if not, modify result, Possibly notify user
                                    self.stockModel.newSlot(result)
                                    self.stockModel.addNewStock(ticker: ticker, positionType: positionType, shares: shares)
                                } else {
                                    self.stockModel.updateErrorState("Not enough money to complete trade.")
                                }
                            }
                            print("stock added")
                        }
                    }
                }
            }
            self.updateStocks()
        }
    }
    
    //MARK: Graph Game
    
    @Published private var graphModel: GraphModel = GraphModel(width: Double(UIScreen.main.bounds.width), height: Double(UIScreen.main.bounds.height))
    
    var graphTimer: Timer?
    var advanceSpeed: Double {
        get {
            if let data = defaults.value(forKey:"advanceSpeed") as? Double {
                return data
            } else {
                return 1
            }
        }
        set {
            defaults.set(newValue, forKey:"advanceSpeed")
        }
    }
    
    @objc func fireGraphTimer(timer: Timer) {
        graphModel.advance()
        print("Advanced")
    }
    func displaySpeed() -> Int {
        if advanceSpeed == 0.5 {
            return 2
        } else if advanceSpeed == 1.0 {
            return 1
        } else if advanceSpeed == 2.0 {
            return 0
        } else {
            return 3
        }
    }
    
    //MARK: Accessors
    func tradeIndicators() -> Array<GraphModel.TradeIndicator> {
        graphModel.tradeIndicators
    }
    
    func graphStats() -> Dictionary<String, String> {
        graphModel.graphStats()
    }
    
    func smaIndex() -> Int {
        graphModel.smaIndex
    }
    
    var currentGraph: GraphModel.Graph {
        graphModel.theGraph
    }
    
    //MARK: Intents
    func buyStock(percent: Double, buying: Bool) {
        graphModel.buyStock(percent: percent, buying: buying)
    }
    
    func nextStock() {
        advance(end: true)
        graphModel.nextStock()
    }
    
    func advance(end: Bool) {
        if advanceSpeed != -1.0 {
            if end {
                graphTimer?.invalidate()
            } else {
                graphTimer = Timer.scheduledTimer(timeInterval: advanceSpeed, target: self, selector: #selector(fireGraphTimer), userInfo: nil, repeats: true)
            }
        } else {
            graphModel.advance()
        }
    }
    
    func setAdvanceSpeed(speed: Int) {
        if speed == 0 {
            advanceSpeed = 2.0
        } else if speed == 1 {
            advanceSpeed = 1.0
        } else if speed == 2 {
            advanceSpeed = 0.5
        } else {
            advanceSpeed = -1.0
        }
    }
    
    func setSMA(index: Int) {
        graphModel.changeSMARange(index: index)
    }
    
    func resetGame() {
        graphTimer?.invalidate()
        graphModel.changeSMARange(index: 0)
        graphModel.resetGame()
    }
    
    func updateTutorialStatus() {
        showTutorial = false
    }
    
    var showTutorial: Bool {
        get {
            if let data = defaults.value(forKey:"showTutorial") as? Bool {
                return data
            } else {
                return true
            }
        }
        set {
            defaults.set(newValue, forKey:"showTutorial")
        }
    }
    
}
