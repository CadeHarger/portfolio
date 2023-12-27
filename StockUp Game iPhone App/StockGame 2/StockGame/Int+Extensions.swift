//
//  Int+Extensions.swift
//  StockGame
//
//  Created by Cade Harger on 9/14/20.
//  Copyright © 2020 Cade Harger. All rights reserved.
//

import Foundation

extension Int {
    var formattedWithSeparator: String {
        return Formatter.withSeparator.string(for: self) ?? ""
    }
}
