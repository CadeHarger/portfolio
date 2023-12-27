//
//  Graph.swift
//  StockGame
//
//  Created by Cade Harger on 10/19/20.
//  Copyright © 2020 Cade Harger. All rights reserved.
//

import Foundation


struct Graph: Identifiable {
    
    init(_ identifier: Int) {
        var prices: Array<String> = []
        for day in graphInfo {
            prices.append(day[identifier])
        }
        points = prices
    }
    
    var points: Array<String>
    var currentDay = 0
    var id: Int
    let daysRange = 60
    
    var minimumBound: Double {
        var lowest = Double(points[0])!
        var range = 0
        if currentDay + daysRange > points.count {
            range = points.count - currentDay
        } else {
            range = daysRange
        }
        for point in points[currentDay...range] {
            if Double(point)! < lowest {
                lowest = Double(point)!
            }
        }
        return lowest
    }
    
    var maximumBound: Double {
        var highest = Double(points[0])!
        var range = 0
        if currentDay + daysRange > points.count {
            range = points.count - currentDay
        } else {
            range = daysRange
        }
        for point in points[currentDay...range] {
            if Double(point)! > highest {
                highest = Double(point)!
            }
        }
        return highest
    }
    
}
