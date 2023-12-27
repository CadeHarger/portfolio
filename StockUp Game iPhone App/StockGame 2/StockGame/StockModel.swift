//
//  StockModel.swift
//  StockGame
//
//  Created by Cade Harger on 8/7/20.
//  Copyright © 2020 Cade Harger. All rights reserved.
//

import Foundation

// All dollar amounts are Ints because of signifigant figures and floating point inaccuracy
// 0 ticker, 1 currentPrice, 2 percentDifference, 3 usdDifference, 4 positionType, 5 shares, 6 personalChange, 7 personal+-, 8 +-, 9 buyPrice, 10 prevPrice, 11 datebought, 12 personal%dif

// Grand Central Dispatch Queue quality of service tasks:
// User Interactive: Everything else
// User Initiated: Scraping web data, filtering for prices
// Utility Queue: Updating stocks every minute or so
// Background Queue: Nothing for now

struct StockModel<SlotContent> {
    
    var defaults: UserDefaults = UserDefaults.standard // Creates ability to save data
    
    var errorState = ""
    let errorReturnArray = ["ERROR","0","0","0","Long","0","0","+","+","0","0","1/1/00","0"]
    let defaultCash = 5000000 // Starting amount of money
    
    private(set) var slots: Array<Slot> {
        get {
            if let data = defaults.value(forKey:"slots") as? Data {
                let newSlots = try! PropertyListDecoder().decode(Array<Slot>.self, from: data)
                return newSlots
            } else {
                return Array<Slot>()
            }
        }
        set {
            defaults.set(try? PropertyListEncoder().encode(newValue), forKey:"slots")
        }
    }

    
    struct Slot: Identifiable, Codable {
        
        var isAdvanced: Bool = false
        
        var content: Array<String>
        var id: Int
        
    }
    
    //MARK: Calculating Overall Stats
    
    private func commaize(_ item: Int) -> String {
        let centsItem = dollarize(item) // Adds commas and dollarizes money strings
        let dollarItem = String(centsItem[centsItem.startIndex..<centsItem.index(centsItem.endIndex, offsetBy: -3)])
        let myIntString = Int(dollarItem)!.formattedWithSeparator + centsItem[centsItem.index(centsItem.endIndex, offsetBy: -3)..<centsItem.endIndex]
        return myIntString
    }
    
    private func dollarize(_ item: Int) -> String {
        let stringItem = String(item) // Converts 2000 to 20.00, and ensures signifigant figures
        //print(stringItem)
        if stringItem.count == 1 {
            return "0.0" + stringItem
        } else if stringItem.count == 2 {
            return "0." + stringItem
        } else {
            let dollars = stringItem[stringItem.startIndex..<stringItem.index(stringItem.endIndex, offsetBy: -2)]
            let cents = stringItem[stringItem.index(stringItem.endIndex, offsetBy: -2)..<stringItem.endIndex]
            return dollars + "." + cents
        }
    }
    
    private var cashOnHand: Int {
        get {
            defaults.integer(forKey: "cashOnHand") == 0 ? defaultCash : defaults.integer(forKey: "cashOnHand")
        }
        set {
            defaults.set(newValue, forKey: "cashOnHand")
        }
    }
    
    private func totalInvested() -> Int {
        var money: Int = 0
        for slot in slots {
            if slot.content[4] == "Long" {
                money += Int(Double(slot.content[1])! * 100) * Int(slot.content[5])!
            }
            else {
                money += Int(Double(slot.content[6])! * 100) * (slot.content[7] == "+" ? 1 : -1) // short position includes money gained/lost
            }
        }
        return money
    }
    
    private func dailyIncrease() -> Int {
        let now = Date()
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .none
        let dateTime = formatter.string(from: now)
        var total = 0
        let invested: Int = totalInvested()
        if invested != 0 {
            if slots.count == 1 {
                return Int(Double(slots[0].content[2])! * 100) * (slots[0].content[8] == "+" ? 1 : -1) * (slots[0].content[4] == "Long" ? 1 : -1)
            } else {
                for slot in slots {
                    if slot.content[11] != dateTime {
                        let isLongTimesShares = (slot.content[4] == "Long" ? 1 : -1) * Int(slot.content[5])!
                        total += (Int(Double(slot.content[1])! * 100) - Int(slot.content[10])!) * isLongTimesShares
                    } else {
                        total += Int(Double(slot.content[6])! * 100) * (slot.content[7] == "+" ? 1 : -1)
                    }
                }
                return Int(Double(total) / Double(invested) * 10000.0)
            }
        } else {
            return 0
        }
    }
    
    private func gainOrLoss() -> String {
        dailyIncrease() >= 0 ? "+" : ""
    }
    
    
    //MARK: Accessors
    
    func calculateStats() -> Array<String> {
        return [commaize(totalInvested() + cashOnHand),commaize(cashOnHand),slots.count == 0 ? "0" : dollarize(dailyIncrease()),String(slots.count),gainOrLoss()] // WRONG
        //0 netBalance, 1 cashOnHand, 2 dailyIncrease, 3 numberOfPositions, 4 gainOrLoss
    }
    
    func infoFromSource(ticker: String, source: String, positionType: String, sharesHeld: String, buyPrice: Int, buyDate: String) -> Array<String> {
        
        if let range: Range<String.Index> = source.range(of: "currentPrice\":{\"raw\":") {
            let currentInt: Int = source.distance(from: source.startIndex, to: range.lowerBound) + 21
            
            let start = source.index(source.startIndex, offsetBy: currentInt)
            let firstCurrentPrice = String(source[start..<source.endIndex])
            
            if let firstIndex = firstCurrentPrice.firstIndex(of: ",") {
                let bracketInt = firstCurrentPrice.distance(from: firstCurrentPrice.startIndex, to: firstIndex)
                
                let end = firstCurrentPrice.index(firstCurrentPrice.startIndex, offsetBy: bracketInt)
                let currentPrice = String(Int(Double(String(firstCurrentPrice[firstCurrentPrice.startIndex..<end]))! * 100))
                
                
                if let prevRange: Range<String.Index> = source.range(of: "{\"previousClose\":{\"raw\":") {
                    let prevInt: Int = source.distance(from: source.startIndex, to: prevRange.lowerBound) + 24
                    
                    let prevStart = source.index(source.startIndex, offsetBy: prevInt)
                    let firstPrevPrice = String(source[prevStart..<source.endIndex])
                    
                    if let prevFirstIndex = firstPrevPrice.firstIndex(of: ",") {
                        let prevBracketInt = firstPrevPrice.distance(from: firstPrevPrice.startIndex, to: prevFirstIndex)
                        
                        let prevEnd = firstPrevPrice.index(firstPrevPrice.startIndex, offsetBy: prevBracketInt)
                        let prevPrice = String(Int(Double(String(firstPrevPrice[firstPrevPrice.startIndex..<prevEnd]))! * 100))
                        
                        //Calculate Stats, ensuring the number of signifigant figures, separating positive/negative values
                        var usdDifference = String(Int(currentPrice)! - Int(prevPrice)!) // General calculations
                        let increaseDecrease = Int(usdDifference)! > 0 ? "+" : "-"
                        usdDifference = String(abs(Int(usdDifference)!))
                        if Double(prevPrice)! == 0 {
                            print("Chosen stock has a previous price of 0")
                            return ["Unable to fetch stock information"]
                        }
                        let percentDifference = self.dollarize(Int((Double(usdDifference)! / Double(prevPrice)!) * 10000.0))
                        
                        var personalChange: String = ""
                        var personalIncreaseDecrease: String = ""
                        
                        if buyPrice != -1 {
                            personalChange = String(Int(sharesHeld)! * (Int(currentPrice)! - buyPrice) * (positionType == "Long" ? 1 : -1)) // Personal calculations
                            personalIncreaseDecrease = Int(personalChange)! >= 0 ? "+" : "-"
                            personalChange = String(abs(Int(personalChange)!))
                        } else {
                            personalChange = "0"
                            personalIncreaseDecrease = "+"
                        }
                        let whyCompiler = Double(personalChange)! / Double(currentPrice)!
                        let personalPercentChange = Int(whyCompiler * 10000.0 / Double(sharesHeld)!) // somehow the percent is being multiplied by shares
                        
                        var dateTime = ""
                        if buyDate == "" {
                            let now = Date()
                            let formatter = DateFormatter()
                            formatter.dateStyle = .short
                            formatter.timeStyle = .none
                            dateTime = formatter.string(from: now)
                        } else {
                            dateTime = buyDate
                        }
                        
                        return [ticker,self.dollarize(Int(currentPrice)!),percentDifference,self.dollarize(Int(usdDifference)!),positionType,sharesHeld,self.dollarize(Int(personalChange)!),personalIncreaseDecrease
                            ,increaseDecrease, buyPrice == -1 ? self.dollarize(Int(currentPrice)!) : self.dollarize(buyPrice), prevPrice, dateTime, self.dollarize(personalPercentChange)]
                        
                    } else {
                        print("previous price bracket not found, failed to update stock")
                        return ["Unable to fetch stock information"]
                    }
                } else {
                    print("previous price location indicator not found, failed to update stock")
                    return ["Unable to fetch stock information"]
                }
                
            } else {
                print("current price bracket not found, failed to update stock")
                return ["Unable to fetch stock information"]
            }
        } else {
            print("current price location indicator not found, failed to update stock")
            return ["Unable to fetch stock information"]
        }
    }
    
    //MARK: Mutators
    
    mutating func makeAdvanced(slot: Slot) {
        if let chosenIndex = slots.firstIndex(matching: slot) {
            slots[chosenIndex].isAdvanced.toggle()
        }
    }
    
    mutating func resetAllStocks() {
        slots = Array<Slot>()
        cashOnHand = defaultCash
        errorState = ""
    }
    
    mutating func addNewStock(ticker: String, positionType: String, shares: Int) {
        errorState = ""
        if positionType == "End Position" {
            var i = 0
            for slot in slots {
                if ticker == slot.content[0] {
                    let newShares = shares > Int(slot.content[5])! ? Int(slot.content[5])! : shares
                    if slot.content[4] == "Long" {
                        cashOnHand += Int(Double(slot.content[1])! * 100) * newShares
                    } else {
                        cashOnHand += (Int(Double(slot.content[9])! * 100) - Int(Double(slot.content[1])! * 100)) * newShares
                    }
                    if Int(slot.content[5])! <= newShares {
                        slots.remove(at: i) // removes the slot if all the shares are ended
                    } else {
                        slots[i].content[5] = String(Int(slots[i].content[5])! - newShares) //updates the slot's number of shares
                    }
                    break
                }
                i += 1
            }
        } else {
            if errorState != "" {
                slots.remove(at: slots.count - 1)
            } else if positionType == "Long" {
                cashOnHand -= Int(shares) * Int(Double(slots[slots.count - 1].content[1])! * 100.0)
            }
        }
    }
    
    mutating func newSlot(_ slot: Array<String>) {
        slots.append(Slot(content: slot, id: slots.count))
    }
    
    mutating func updateErrorState(_ error: String) {
        errorState = error
    }
    
    mutating func removeSlot(_ i: Int) {
         slots.remove(at: i)
    }
     
    mutating func updateStock(at: Int, with: Array<String>) {
        slots[at].content = with
    }
    
    func isAffordable(slot: Array<String>) -> Bool {
        return (Double(cashOnHand) / 100) - (Double(slot[1])! * Double(slot[5])!) >= 0
    }
    
}
