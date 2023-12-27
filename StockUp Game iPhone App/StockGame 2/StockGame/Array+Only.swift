//
//  Array+Only.swift
//  Memorize
//
//  Created by Cade Harger on 7/20/20.
//  Copyright © 2020 Cade Harger. All rights reserved.
//

import Foundation

// makes makes only be able to return the only element in the array or nil if there is none

extension Array {
    var only: Element? {
        count == 1 ? first : nil
    }
}
