//
//  GraphModel.swift
//  StockGame
//
//  Created by Cade Harger on 10/15/20.
//  Copyright © 2020 Cade Harger. All rights reserved.
//

import Foundation
// Data points in the file are random stocks and their daily prices for the past 5 years. Starts with old numbers

struct GraphModel {
    
    var defaults: UserDefaults // Creates ability to save data
    
    private(set) var theGraph: Graph
    
    var graphInfo: Array<Array<String>> // Only using the length right now
    var tickers: Array<String>
    
    init(width: Double, height: Double) {
        defaults = UserDefaults.standard
        systemWidth = width
        systemHeight = height
        var file: Array<String> = []
        if let path = Bundle.main.path(forResource: "GraphInfo", ofType: "csv") {
            do {
                let data = try String(contentsOfFile: path, encoding: .utf8)
                file = data.components(separatedBy: .newlines)
            } catch {
                print(error)
                file = [""]
            }
        } else {
            print("no such file")
            file = [""]
        }
        tickers = file[0].components(separatedBy: ",")
        tickers.remove(at: tickers.count - 1)
        file.remove(at: 0)
        file.remove(at: file.count - 1)
        var temp: Array<Array<String>> = []
        var count = 0
        for line in file {
            if count % 2 != 0 {
                temp.append(line.components(separatedBy: ","))
            }
            count += 1
        }
        graphInfo = temp
        var storedGraph: Int
        if let data = defaults.value(forKey:"graphNumber") as? Int {
            storedGraph = data
        } else {
            storedGraph = 0
        }
        var storedDay: Int
        if let data = defaults.value(forKey:"graphCurrentDay") as? Int {
            storedDay = data
        } else {
            storedDay = 0
        }
        var storedSMA: Int
        if let data = defaults.value(forKey:"smaIndex") as? Int {
            storedSMA = data
        } else {
            storedSMA = 0
        }
        theGraph = Graph(graphNumber: storedGraph, graphData: graphInfo, day: storedDay, sma: storedSMA, systemWidth: systemWidth)
    }
    
    var systemWidth: Double
    var systemHeight: Double
    struct TradeIndicator: Identifiable {
        init(relativeDay: Int, location: Int) {
            day = relativeDay
            id = location
        }
        var day: Int
        var id: Int
    }
    struct GraphPoint: Identifiable {
        init(yCoord: Int, location: Int) {
            point = yCoord
            id = location
        }
        var point: Int
        var id: Int
    }
    struct Helper: Identifiable {
        init(price: Double, location: Int) {
            let stringItem = String(Int(price * 100)) // Converts 2000 to 20.00 and ensures signifigant figures
            var dollarPoint = ""
            if stringItem.count == 1 {
                dollarPoint =  "0.0" + stringItem
            } else if stringItem.count == 2 {
                dollarPoint =  "0." + stringItem
            } else {
                let dollars = stringItem[stringItem.startIndex..<stringItem.index(stringItem.endIndex, offsetBy: -2)]
                let cents = stringItem[stringItem.index(stringItem.endIndex, offsetBy: -2)..<stringItem.endIndex]
                dollarPoint =  dollars + "." + cents
            }
            point = dollarPoint
            id = location
        }
        var point: String
        var id: Int
    }
    struct Graph {
        //MARK: Graph
        init(graphNumber: Int, graphData: Array<Array<String>>, day: Int, sma: Int, systemWidth: Double) {
            var pricelist: Array<String> = []
            //var i = 0
            for day in graphData {
                //print(day, graphNumber, i, day.count)
                pricelist.append( day[graphNumber] )
                //i += 1
            }
            prices = pricelist
            id = graphNumber
            currentDay = day
            graphHeight = Int(systemWidth - 44)
            setSMARange(newRange: sma)
        }
        
        var points: Array<GraphPoint> {
            var range = 0
            var pointList: Array<GraphPoint> = []
            let minBound = minimumBound(oldRange: daysRange, latestDay: currentActualDay)
            let maxBound = maximumBound(oldRange: daysRange, latestDay: currentActualDay)
            if currentActualDay > prices.count {
                range = prices.count - currentDay
            } else {
                range = daysRange
            }
            var i = 0
            for price in prices[currentDay...currentDay + range] {
                let ratio = 1 - ((Double(price)! -  minBound) / (maxBound - minBound))
                pointList.append(GraphPoint(yCoord: Int((ratio * Double(graphHeight)).rounded(.up)), location: i))
                i += 1
            }
            //print(prices[0],prices[daysRange],pointList[daysRange])
            return pointList
        }
        
        var currentPrice: Int {
            Int(Double(prices[currentActualDay])! * 100)
        }
        var previousPrice: Int {
            Int(Double(prices[currentActualDay - 1])! * 100)
        }
        var prices: Array<String>
        var currentDay: Int
        var currentActualDay: Int {
            currentDay + daysRange
        }
        
        var defaults = UserDefaults.standard
        var id: Int
        var graphHeight: Int
        var isSMAOn = true
        private var smaRange = 20
        let daysRange = 59
        let helperCount = 5
        
        var helpers: Array<Helper> {
            let minBound = minimumBound(oldRange: daysRange, latestDay: currentActualDay)
            let maxBound = maximumBound(oldRange: daysRange, latestDay: currentActualDay)
            let range = (maxBound - minBound) / Double(helperCount)
            var helperList: Array<Helper> = []
            for i in 0..<helperCount + 1 {
                helperList.append(Helper(price: (range * Double(i)) + minBound, location: i))
            }
            return helperList
        }
        var simpleMovingAverage: Array<GraphPoint> {
            //print("Calculating...                       !!!") //change this to initializer and then modifier to speed up???
            if isSMAOn {
                var result: Array<GraphPoint> = []
                let max = maximumBound(oldRange: daysRange, latestDay: currentActualDay)
                let min = minimumBound(oldRange: daysRange, latestDay: currentActualDay)
                for day in currentDay...currentActualDay {
                    var newRange = smaRange
                    if day - smaRange < 0 {
                        newRange = day
                    }
                    var total = 0.0
                    for nestedPrice in (day - newRange)...day {
                        total += Double(prices[nestedPrice])!
                    }
                    let average = total / Double(newRange + 1)
                    var weighted = Int(((1.0 - ((average - min) / (max - min))) * Double(graphHeight)).rounded(.up))
                    if weighted > graphHeight {
                        weighted = graphHeight + 1
                    } else if weighted < 0 {
                        weighted = 0
                    }
                    //print(average, total, weighted, Int(weighted.rounded(.up)))
                    result.append(GraphPoint(yCoord: weighted, location: day - currentDay))
                }
                return result
            } else {
                return []
            }
        }
        
        func canAdvance() -> Bool {
            return currentActualDay < prices.count - 1
        }
        
        func minimumBound(oldRange: Int, latestDay: Int) -> Double {
            var lowest = Double(prices[currentDay])!
            let range = daysRange + latestDay - oldRange
            for point in prices[latestDay - oldRange..<range + 1] {
                if Double(point)! < lowest {
                    lowest = Double(point)!
                }
            }
            return lowest
        }
        func maximumBound(oldRange: Int, latestDay: Int) -> Double {
            var highest = Double(prices[currentDay])!
            let range = daysRange + latestDay - oldRange
            for point in prices[latestDay - oldRange...range] {
                if Double(point)! > highest {
                    highest = Double(point)!
                }
            }
            return highest
        }
        
        mutating func setSMARange(newRange: Int) {
            isSMAOn = newRange != 0
            if newRange == 1 {
                smaRange = 5
            } else if newRange == 2 {
                smaRange = 10
            } else if newRange == 3 {
                smaRange = 20
            } else if newRange == 4 {
                smaRange = 30
            } else {
                smaRange = 60
            }
        }
    }
    
    //MARK: StockPosition
    struct StockPosition: Identifiable, Codable {
        init(identifier: Int, currentDay: Int, boughtAt: Int, sharesBought: Int) {
            id = identifier
            buyPrice = boughtAt
            shares = sharesBought
            dayBought = currentDay
        }
        var id: Int
        var dayBought: Int
        var buyPrice: Int
        var shares: Int
        
        func yield(currentPrice: Int) -> Int {
            return (currentPrice - buyPrice) * shares
        }
        
        mutating func modifyShares(by: Int) {
            shares += by
        }
    }
    
    private func commaize(_ item: Int) -> String {
        let centsItem = dollarize(item) // Adds commas and dollarizes money strings
        let dollarItem = String(centsItem[centsItem.startIndex..<centsItem.index(centsItem.endIndex, offsetBy: -3)])
        let myIntString = Int(dollarItem)!.formattedWithSeparator + centsItem[centsItem.index(centsItem.endIndex, offsetBy: -3)..<centsItem.endIndex]
        return myIntString
    }
    
    private func dollarize(_ item: Int) -> String {
        let stringItem = String(item) // Converts 2000 to 20.00 and ensures signifigant figures
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
    
    //MARK: Mutators
    
    mutating func resetGame() {
        changeSMARange(index: 0)
        positions = []
        cashPile = 5000000
        currentGraphDay = 0
        currentGraphNum = 0
        theGraph = Graph(graphNumber: currentGraphNum, graphData: graphInfo, day: currentGraphDay, sma: smaIndex, systemWidth: systemWidth)
        
    }
    
    mutating func buyStock(percent: Double, buying: Bool) {
        var ending = false
        if positions.count != 0 {
            ending = (positions[0].shares < 0) == buying
        }
        if ending {
            for i in 0..<positions.count {
                let sharesDifference = Int((percent * Double(positions[i].shares)).rounded(.up))
                cashPile += sharesDifference * theGraph.currentPrice
                positions[i].modifyShares(by: sharesDifference * -1)
            }
            if percent == 1.0 {
                positions = []
            }
        } else {
            var newShares = 0
            if buying {
                newShares = Int(((Double(cashPile) * percent / 100) / (Double(theGraph.currentPrice) / 100)).rounded(.down))
            } else {
                var totalSpent = 0
                for position in positions {
                    totalSpent += 2 * abs(position.buyPrice * position.shares)
                }
                newShares = Int(((Double(cashPile - totalSpent) * percent / 100) / (Double(theGraph.currentPrice) / 100)).rounded(.down)) * -1
                print(totalSpent, newShares, theGraph.currentPrice)
            }
            positions.append(StockPosition(identifier: positions.count, currentDay: theGraph.currentActualDay, boughtAt: theGraph.currentPrice, sharesBought: newShares))
            cashPile = cashPile - (theGraph.currentPrice * newShares) //wrong: adds the shorted stock money to the users account
        }
    }
    
    mutating func nextStock() {
        print("CurrentGraphNumber: ", currentGraphNum, "tickers: ", tickers.count)
        for position in positions {
            print(position, cashPile, theGraph.currentPrice, position.shares)
            cashPile += (theGraph.currentPrice) * position.shares
        }
        positions = []
        if currentGraphNum + 1 >= tickers.count {
            currentGraphNum = 0
            theGraph = Graph(graphNumber: 0, graphData: graphInfo, day: 0, sma: smaIndex, systemWidth: systemWidth)
            print("Cycled through all graphs")
        } else {
            currentGraphNum += 1
            print(tickers[currentGraphNum], currentGraphNum)
            theGraph = Graph(graphNumber: currentGraphNum, graphData: graphInfo, day: 0, sma: smaIndex, systemWidth: systemWidth)
            //print(graphPoints(graphNumber: currentGraphNum), graphPoints(graphNumber: currentGraphNum).count)
        }
    }
    
    mutating func advance() {
        if theGraph.canAdvance() {
            print("trades: ", tradeIndicators)
            theGraph.currentDay += 1
            currentGraphDay = theGraph.currentDay
        }
    }
    
    mutating func changeSMARange(index: Int) {
        smaIndex = index
        theGraph.setSMARange(newRange: index)
    }
    
    //MARK: Accessors
    
    var tradeIndicators: Array<TradeIndicator> {
        var indicators: Array<TradeIndicator> = []
        for position in positions {
            if theGraph.currentActualDay - position.dayBought < theGraph.daysRange {
                indicators.append(TradeIndicator(relativeDay: theGraph.currentActualDay - position.dayBought, location: position.id))
            }
        }
        return indicators
    }
    
    func graphStats() -> Dictionary<String,String> {
        var totalYield = 0
        var invested = 0
        var netWorth = cashPile
        let theCurrentPrice = theGraph.currentPrice
        for position in positions {
            totalYield += position.yield(currentPrice: theCurrentPrice)
            invested += position.shares * position.buyPrice
            netWorth += position.shares * theCurrentPrice
        }
        let isIncreasing = ((theCurrentPrice - theGraph.previousPrice) >= 0) ? "+" : "-"
        let totalIncrease = totalYield >= 0 ? "+" : "-"
        var last = 0
        var anything = false
        if positions.count != 0 {
            last = positions[positions.count - 1].buyPrice
            anything = true
            //print(positions[0].shares)
        } else {
            last = 0
        }
        return [
            "Net Worth" : commaize(netWorth),
            "Cash On Hand" : commaize(cashPile),
            "Price" : commaize(theCurrentPrice),
            "Buy Price" : commaize(last),
            "Daily Change" : commaize(abs(theCurrentPrice - theGraph.previousPrice)),
            "Increase or Decrease" : isIncreasing,
            "Total Increase or Decrease" : totalIncrease,
            "$ Change" : commaize(abs(totalYield)),
            "% Change" : anything ? commaize(abs(Int(1000 * Double(totalYield) / Double(invested)))) : "0.00", 
            "Day Bought" : anything ? String(theGraph.currentActualDay - positions[positions.count - 1].dayBought) : "0",
            "Long or Short" : anything ? (positions[0].shares >= 0 ? "Long" : "Short") : "None"
        ]
    }
    
    //MARK: Vars
    
    var positions: Array<StockPosition> {
        get {
            if let data = defaults.value(forKey:"positions") as? Data {
                let newSlots = try! PropertyListDecoder().decode(Array<StockPosition>.self, from: data)
                return newSlots
            } else {
                return Array<StockPosition>()
            }
        }
        set {
            defaults.set(try? PropertyListEncoder().encode(newValue), forKey:"positions")
        }
    }
    var cashPile: Int {
        get {
            if let data = defaults.value(forKey:"cashPile") as? Int {
                return data
            } else {
                return 5000000
            }
        }
        set {
            defaults.set(newValue, forKey:"cashPile")
        }
    }
    var currentGraphNum: Int {
        get {
            if let data = defaults.value(forKey:"graphNumber") as? Int {
                return data
            } else {
                return 0
            }
        }
        set {
            defaults.set(newValue, forKey:"graphNumber")
        }
    }
    var currentGraphDay: Int {
        get {
            if let data = defaults.value(forKey:"graphCurrentDay") as? Int {
                return data
            } else {
                return 0
            }
        }
        set {
            defaults.set(newValue, forKey:"graphCurrentDay")
        }
    }
    var smaIndex: Int {
        get {
            if let data = defaults.value(forKey:"smaIndex") as? Int {
                return data
            } else {
                return 0
            }
        }
        set {
            defaults.set(newValue, forKey:"smaIndex")
        }
    }
}
