//
//  Array+Identifiable.swift
//  Memorize
//
//  Created by Cade Harger on 7/17/20.
//  Copyright © 2020 Cade Harger. All rights reserved.
//

import Foundation

// finds the index of the tapped item in but adds the capability to array. constrains array to identifiable but gains capability of firstIndex
extension Array where Element: Identifiable {
    func firstIndex(matching: Element) -> Int? {
        for index in 0..<self.count {
            if self[index].id == matching.id {
                return index
            }
        }
        return nil
    }
}
