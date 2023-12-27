//
//   Formatter+Extensions.swift
//  StockGame
//
//  Created by Cade Harger on 9/14/20.
//  Copyright © 2020 Cade Harger. All rights reserved.
//

import Foundation

extension Formatter {
    static let withSeparator: NumberFormatter = {
        let formatter = NumberFormatter()
        formatter.groupingSeparator = ","
        formatter.numberStyle = .decimal
        return formatter
    }()
}
