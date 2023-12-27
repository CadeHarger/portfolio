//
//  ContentView.swift
//  StockGame
//
//  Created by Cade Harger on 8/7/20.
//  Copyright © 2020 Cade Harger. All rights reserved.
//

import SwiftUI

// @observedobject makes the view read the @published changes to the model and redraw
// trailing closure syntax allows the calling of structs from HStack(argument?,{code}) to Hstack {code} ≈
//
// Location 0: Default/Home
// Location 1: Add New Stock
// Location 2: Settings
// Location 3: Graph Settings
// Location 4: Graph Game
// Location 5: Tutorial
//
//
//8: 375/667, 8 Plus: 414/736, 11: 414/896, 11 Pro: 375/812, 11 Pro Max: 414/896

struct StockView: View {
    @ObservedObject var viewModel: StockViewModel
    
    @State var ticker: String = ""
    @State var shares: String = ""
    @State private var typeIndex = 0
    var typeOptions = ["Long" ,"Short", "End Position"]
    
    @State var location: Int = 0
    @State var advancedStats = false
    
    @State var showingAlert = false
    
    @State var isAdvancing = false
    @State var isTrading = false
    @State var buying = true
    
    //MARK: Settings
    @State private var refreshTimeIndex: Int = 0
    let refreshTimeOptions = ["30 Seconds", "1 Minute", "2 Minutes", "5 Minutes", "10 Minutes", "Never"]
    @State private var advanceSpeedIndex: Int = 1
    let advanceSpeedOptions = ["Slow", "Normal", "Fast", "Manual"]
    @State private var SMAIndex: Int = 0
    let SMAOptions = ["Off", "5", "10", "20", "30", "60"]
    
    //MARK: Body
    var body: some View {
        if location == 0 {
            return AnyView(VStack {
                HStack(spacing: 10) {
                    StatView(stat: viewModel.stats, advanced: advancedStats)
                        .padding(.leading, 12)
                        .padding(.trailing, 12)
                        .onTapGesture(count: 1) {
                            withAnimation(.easeOut(duration: 2)) {
                                self.advancedStats.toggle()
                            }
                        }
                        .offset(y: advancedStats ? 0 : 6)
                    
                    ZStack {
                        RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                            .fill(Color.gray)
                            .overlay(
                                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                    .stroke(Color(red: buttonOutlineColor, green: buttonOutlineColor, blue: buttonOutlineColor), lineWidth: buttonOutlineWidth)
                        )
                            .frame(width: buttonSize, height: buttonSize)
                            .opacity(buttonColor)
                        Button(action: {
                            withAnimation {
                                if self.viewModel.showTutorial {
                                    self.location = 5
                                    self.viewModel.updateTutorialStatus()
                                } else {
                                    self.location = 4
                                }
                            }   // turn off the timer temporarily to stop unneccessary calculations/redrawing of view. (bool isOn with default value?)
                        }, label: {
                            Text("📈").foregroundColor(Color.black).fontWeight(.light).font(.system(size: 34))
                        })
                    }
                    .offset(y: advancedStats ? 0 : 6)
                    
                    ZStack {
                        RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                            .fill(Color.gray)
                            .overlay(
                                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                    .stroke(Color(red: buttonOutlineColor, green: buttonOutlineColor, blue: buttonOutlineColor), lineWidth: buttonOutlineWidth)
                        )
                            .frame(width: buttonSize, height: buttonSize)
                            .opacity(buttonColor)
                        Button(action: {
                            withAnimation {
                                self.location = 1
                            }
                        }, label: {
                            Text("+").foregroundColor(Color.black).fontWeight(.light).font(.system(size: 34)).offset(y: -1)
                        })
                    }
                    .offset(y: advancedStats ? 0 : 6)
                
                    ZStack {
                        RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                            .fill(Color.gray)
                            .overlay(
                                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                    .stroke(Color(red: buttonOutlineColor, green: buttonOutlineColor, blue: buttonOutlineColor), lineWidth: buttonOutlineWidth)
                        )
                            .frame(width: buttonSize, height: buttonSize)
                            .opacity(buttonColor)
                        Button(action: {
                            withAnimation {
                                self.refreshTimeIndex = self.viewModel.refreshIndex
                                self.location = 2
                            }
                        }, label: {
                            Text("⚙︎").foregroundColor(Color.black).fontWeight(.light).font(.system(size: 34)).offset(y: -1)
                        })
                    }
                    .offset(y: advancedStats ? 0 : 6)
                    .padding(.trailing, 16)
                }
                .padding(3)
                
                Rectangle()
                .fill(Color.gray)
                .frame(width: screenWidth, height: 4) // The gray bar separating the stats from slots
                
                List(viewModel.slots) { slot in
                    SlotView(slot: slot)
                        .padding(.top, 16)
                        .padding(.bottom, 16)
                        .onTapGesture {
                            withAnimation(.linear(duration: 0.15)) {
                                self.viewModel.makeAdvanced(slot: slot)
                            }
                        }
                }
                if viewModel.errorState != "" {
                    withAnimation(.linear) {
                        ZStack {
                            Rectangle()
                                .fill(Color.red)
                                .frame(height: 50)
                            HStack {
                                Text(viewModel.errorState).font(.system(size: 17))
                                Spacer()
                                Button(action: {
                                    withAnimation(.linear) {
                                        self.viewModel.toggleError()
                                    }
                                }, label: {
                                    Text("X").foregroundColor(Color.black).fontWeight(.medium).font(.system(size: 17))
                                })
                            }
                            .frame(width: UIScreen.main.bounds.width - 35)
                        }
                    }
                }
            }
        )} else if location == 1 {
            
            //MARK: New Stock View
            return AnyView(
                Group {
                    NavigationView {
                        Form {
                            TextField("Ticker: ", text: $ticker)
                            TextField("Shares: ", text: $shares)
                                .keyboardType(.numberPad)
                            Section {
                                Picker(selection: $typeIndex, label: Text("Position Type")) {
                                    ForEach(0..<typeOptions.count) {
                                        Text(self.typeOptions[$0])
                                    }
                                }
                            }
                        }
                        .navigationBarTitle("New Stock", displayMode: .inline)
                        .navigationBarItems(leading:
                            Button(action: {
                                withAnimation {
                                    self.location = 0
                                }
                            }) {
                                Text("Cancel")
                            }, trailing:
                            Button(action: {
                                withAnimation {
                                    if self.ticker != "" && self.shares != "" {
                                        self.location = 0
                                        self.viewModel.addNewStock(
                                            ticker: self.ticker.uppercased(),
                                            positionType: self.typeOptions[self.typeIndex],
                                            shares: Int(self.shares) ?? 0
                                        )
                                        self.ticker = ""
                                        self.shares = ""
                                    } else {
                                        self.showingAlert = true
                                    }
                                }
                            }) {
                                Text("Confirm")
                        })
                    }
                    .alert(isPresented: $showingAlert) {
                        Alert(
                            title: Text("Error"),
                            message: Text("Please enter all information into fields"),
                            dismissButton: .default(Text("Dismiss"))
                        )
                    }
                }
            )
        } else if location == 2 {
            //MARK: Settings
            return AnyView (
                Group {
                    NavigationView {
                        Form {
                            Section(header: Text("GENERAL")) {
                                Picker(selection: $refreshTimeIndex, label: Text("Automatically refresh stocks")) {
                                    ForEach(0..<refreshTimeOptions.count) {
                                        Text(self.refreshTimeOptions[$0])
                                    }
                                }
                            }
                            Section {
                                NavigationLink(destination: AboutView()) {
                                    Text("About/Help")
                                }.buttonStyle(PlainButtonStyle())
                                Button(action: {
                                    self.showingAlert = true
                                }) {
                                    Text("Reset Portfolio")
                                }
                            }
                        }
                        .navigationBarTitle("StockUp Settings")
                        .navigationBarItems(leading:
                            Button(action: {
                                self.viewModel.updateTimer(index: self.refreshTimeIndex)
                                withAnimation {
                                    self.location = 0
                                }
                            }) {
                                Text("Back")
                            }
                        )
                    }
                    .alert(isPresented: $showingAlert) {
                        Alert(
                            title: Text("Are you sure?"),
                            message: Text("Are you sure you want to reset your portfolio? All existing positions will be ended."),
                            primaryButton: .destructive(Text("Reset")) {
                                self.viewModel.updateTimer(index: self.refreshTimeIndex)
                                self.viewModel.resetAllStocks()
                                self.location = 0
                            }, secondaryButton: .cancel()
                        )
                    }
                }
            )
        } else if location == 4 {
            //MARK: Graph Game
            return AnyView(
                VStack {
                    HStack(spacing: 10) {
                        StockStatView(advanced: advancedStats, stats: viewModel.graphStats())
                            .padding(.leading, 12)
                            .padding(.trailing, 12)
                            .onTapGesture(count: 1) {
                                withAnimation {
                                    self.advancedStats.toggle()
                                }
                        }
                        .offset(y: advancedStats ? 0 : 6)
                        
                        ZStack {
                            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                .fill(Color.gray)
                                .overlay(
                                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                        .stroke(Color(red: buttonOutlineColor, green: buttonOutlineColor, blue: buttonOutlineColor), lineWidth: buttonOutlineWidth)
                            )
                                .frame(width: buttonSize, height: buttonSize)
                                .opacity(buttonColor)
                            Button(action: {
                                withAnimation {
                                    self.location = 0
                                }
                            }, label: {
                                Text("＄").foregroundColor(Color.black).fontWeight(.light).font(.system(size: 34))
                            })
                        }
                        .offset(y: advancedStats ? 0 : 6)
                        ZStack {
                            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                .fill(Color.gray)
                                .overlay(
                                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                        .stroke(Color(red: buttonOutlineColor, green: buttonOutlineColor, blue: buttonOutlineColor), lineWidth: buttonOutlineWidth)
                            )
                                .frame(width: buttonSize, height: buttonSize)
                                .opacity(buttonColor)
                            Button(action: {
                                self.viewModel.advance(end: true)
                                self.isAdvancing = false
                                self.SMAIndex = self.viewModel.smaIndex()
                                self.advanceSpeedIndex = self.viewModel.displaySpeed()
                                withAnimation {
                                    self.location = 3
                                }
                            }, label: {
                                Text("⚙︎").foregroundColor(Color.black).fontWeight(.light).font(.system(size: 34)).offset(y: -1)
                            })
                        }
                        .offset(y: advancedStats ? 0 : 6)
                        .padding(.trailing, 16)
                    }
                    .padding(3)
                    .offset(y: advancedStats ? 6 : 0)
                    
                    GraphView(graph: viewModel.currentGraph, tradeIndicators: viewModel.tradeIndicators(), hasProfited: viewModel.graphStats()["Total Increase or Decrease"]!)
                    
                    HStack {
                        StockInfoView(stats: viewModel.graphStats())
                        VStack(spacing: 4) {
                            if !isTrading {
                                ZStack {
                                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                        .fill(Color.gray)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                                .stroke(Color(red: buttonOutlineColor, green: buttonOutlineColor, blue: buttonOutlineColor), lineWidth: buttonOutlineWidth)
                                    )
                                        .frame(width: buyButtonWidth, height: buyButtonHeight)
                                        .opacity(buttonColor)
                                    Button(action: {
                                        withAnimation {
                                            print("Bought Stock")
                                            self.buying = true
                                            self.isTrading = true
                                        }
                                    }, label: {
                                        Text("Buy").foregroundColor(Color.black).fontWeight(.light).font(.system(size: 34)).offset(y: -1)
                                    })
                                }
                                .frame(width: buyButtonWidth, height: buyButtonHeight)
                                .offset(x: shiftButtons)
                                ZStack {
                                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                        .fill(Color.gray)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                                .stroke(Color(red: buttonOutlineColor, green: buttonOutlineColor, blue: buttonOutlineColor), lineWidth: buttonOutlineWidth)
                                    )
                                        .frame(width: buyButtonWidth, height: buyButtonHeight)
                                        .opacity(buttonColor)
                                    Button(action: {
                                        withAnimation {
                                            print("Sold Stock")
                                            self.buying = false
                                            self.isTrading = true
                                        }
                                    }, label: {
                                        Text("Sell").foregroundColor(Color.black).fontWeight(.light).font(.system(size: 34)).offset(y: -1)
                                    })
                                }
                                .frame(width: buyButtonWidth, height: buyButtonHeight)
                                .offset(x: shiftButtons)
                                ZStack {
                                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                        .fill(Color.gray)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                                .stroke(Color(red: buttonOutlineColor, green: buttonOutlineColor, blue: buttonOutlineColor), lineWidth: buttonOutlineWidth)
                                    )
                                        .frame(width: buyButtonWidth, height: buyButtonHeight)
                                        .opacity(buttonColor)
                                    Button(action: {
                                        withAnimation {
                                            self.viewModel.nextStock()
                                            print("Next Stock")
                                        }
                                    }, label: {
                                        Text("Next").foregroundColor(Color.black).fontWeight(.light).font(.system(size: 34)).offset(y: -1)
                                    })
                                }
                                .frame(width: buyButtonWidth, height: buyButtonHeight)
                                .offset(x: shiftButtons)
                                ZStack {
                                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                        .fill(Color.gray)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                                .stroke(Color(red: buttonOutlineColor, green: buttonOutlineColor, blue: buttonOutlineColor), lineWidth: buttonOutlineWidth)
                                    )
                                        .frame(width: buyButtonWidth, height: buyButtonHeight)
                                        .opacity(buttonColor)
                                    Button(action: {
                                        withAnimation {
                                            self.viewModel.advance(end: self.isAdvancing)
                                        }
                                        if self.viewModel.advanceSpeed != -1.0 {
                                            self.isAdvancing.toggle() //For view only, no other functionality
                                            print(self.isAdvancing ? "Proceeding" : "Stopping")
                                        }
                                    }, label: {
                                        Text(self.isAdvancing ? "Stop" : "Go").foregroundColor(Color.black).fontWeight(.light).font(.system(size: 34)).offset(y: -1)
                                    })
                                }
                                .frame(width: buyButtonWidth, height: buyButtonHeight)
                                .offset(x: shiftButtons)
                            } else {
                                ZStack {
                                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                        .fill(Color.gray)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                                .stroke(Color(red: buttonOutlineColor, green: buttonOutlineColor, blue: buttonOutlineColor), lineWidth: buttonOutlineWidth)
                                    )
                                        .frame(width: buyButtonWidth, height: tradingHeight)
                                        .opacity(buttonColor)
                                    Button(action: {
                                        withAnimation {
                                            print("10%")
                                            self.viewModel.buyStock(percent: 0.10, buying: self.buying)
                                            self.isTrading = false                                        }
                                    }, label: {
                                        Text("10%").foregroundColor(Color.black).fontWeight(.light).font(tradingFont).offset(y: -1)
                                    })
                                }
                                .frame(width: buyButtonWidth, height: tradingHeight)
                                .offset(x: shiftButtons)
                                ZStack {
                                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                        .fill(Color.gray)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                                .stroke(Color(red: buttonOutlineColor, green: buttonOutlineColor, blue: buttonOutlineColor), lineWidth: buttonOutlineWidth)
                                    )
                                        .frame(width: buyButtonWidth, height: tradingHeight)
                                        .opacity(buttonColor)
                                    Button(action: {
                                        withAnimation {
                                            print("25%")
                                            self.viewModel.buyStock(percent: 0.25, buying: self.buying)
                                            self.isTrading = false                                      }
                                    }, label: {
                                        Text("25%").foregroundColor(Color.black).fontWeight(.light).font(tradingFont).offset(y: -1)
                                    })
                                }
                                .frame(width: buyButtonWidth, height: tradingHeight)
                                .offset(x: shiftButtons)
                                ZStack {
                                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                        .fill(Color.gray)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                                .stroke(Color(red: buttonOutlineColor, green: buttonOutlineColor, blue: buttonOutlineColor), lineWidth: buttonOutlineWidth)
                                    )
                                        .frame(width: buyButtonWidth, height: tradingHeight)
                                        .opacity(buttonColor)
                                    Button(action: {
                                        withAnimation {
                                            print("50%")
                                            self.viewModel.buyStock(percent: 0.50, buying: self.buying)
                                            self.isTrading = false                                      }
                                    }, label: {
                                        Text("50%").foregroundColor(Color.black).fontWeight(.light).font(tradingFont).offset(y: -1)
                                    })
                                }
                                .frame(width: buyButtonWidth, height: tradingHeight)
                                .offset(x: shiftButtons)
                                ZStack {
                                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                        .fill(Color.gray)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                                .stroke(Color(red: buttonOutlineColor, green: buttonOutlineColor, blue: buttonOutlineColor), lineWidth: buttonOutlineWidth)
                                    )
                                        .frame(width: buyButtonWidth, height: tradingHeight)
                                        .opacity(buttonColor)
                                    Button(action: {
                                        withAnimation {
                                            print("75%")
                                            self.viewModel.buyStock(percent: 0.75, buying: self.buying)
                                            self.isTrading = false                                      }
                                    }, label: {
                                        Text("75%").foregroundColor(Color.black).fontWeight(.light).font(tradingFont).offset(y: -1)
                                    })
                                }
                                .frame(width: buyButtonWidth, height: tradingHeight)
                                .offset(x: shiftButtons)
                                ZStack {
                                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                        .fill(Color.gray)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                                .stroke(Color(red: buttonOutlineColor, green: buttonOutlineColor, blue: buttonOutlineColor), lineWidth: buttonOutlineWidth)
                                    )
                                        .frame(width: buyButtonWidth, height: tradingHeight)
                                        .opacity(buttonColor)
                                    Button(action: {
                                        withAnimation {
                                            print("90%")
                                            self.viewModel.buyStock(percent: 0.90, buying: self.buying)
                                            self.isTrading = false                                      }
                                    }, label: {
                                        Text("90%").foregroundColor(Color.black).fontWeight(.light).font(tradingFont).offset(y: -1)
                                    })
                                }
                                .frame(width: buyButtonWidth, height: tradingHeight)
                                .offset(x: shiftButtons)
                                ZStack {
                                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                        .fill(Color.gray)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                                                .stroke(Color(red: buttonOutlineColor, green: buttonOutlineColor, blue: buttonOutlineColor), lineWidth: buttonOutlineWidth)
                                    )
                                        .frame(width: buyButtonWidth, height: tradingHeight)
                                        .opacity(buttonColor)
                                    Button(action: {
                                        withAnimation {
                                            print("100%")
                                            self.viewModel.buyStock(percent: 1.00, buying: self.buying)
                                            self.isTrading = false                                      }
                                    }, label: {
                                        Text("100%").foregroundColor(Color.black).fontWeight(.light).font(tradingFont).offset(y: -1)
                                    })
                                }
                                .frame(width: buyButtonWidth, height: tradingHeight)
                                .offset(x: shiftButtons)
                            }
                        }
                    }
                }
            )
        } else if location == 5 {
            //MARK: Tutorial
            return AnyView (
                Group {
                    NavigationView {
                        VStack(spacing: 30) {
                            Rectangle()
                            .opacity(0.0)
                            .frame(height: 1)
                            Image("Logo")
                            Rectangle()
                                .opacity(0.0)
                                .frame(height: 1)
                            Text("""
                            Welcome to the Graph Game
                            """).font(.system(size: 34)).fontWeight(.bold).multilineTextAlignment(.center)
                            NavigationLink(destination: HowToPlayView()) {
                                Text("How To Play").font(.system(size: 28))
                            }.buttonStyle(PlainButtonStyle())
                            Button(action: {
                                withAnimation {
                                    self.location = 4
                                }
                            }, label: {
                                Text("Play Game").foregroundColor(Color.black).fontWeight(.light).font(.system(size: 28))
                            })
                            Spacer()
                            Text("How To Play can always be accessed in Graph Game Settings.").font(.system(size: 20)).multilineTextAlignment(.center).padding()
                        }
                    }
                }
            )
        } else {
            //MARK: Graph Settings
            return AnyView (
                Group {
                    NavigationView {
                        Form {
                            Section(header: Text("GENERAL")) {
                                Picker(selection: $advanceSpeedIndex, label: Text("Advance Speed")) {
                                    ForEach(0..<advanceSpeedOptions.count) {
                                        Text(self.advanceSpeedOptions[$0])
                                    }
                                }
                                Picker(selection: $SMAIndex, label: Text("Simple Moving Average")) {
                                    ForEach(0..<SMAOptions.count) {
                                        Text(self.SMAOptions[$0])
                                    }
                                }
                            }
                            Section {
                                NavigationLink(destination: AboutView()) {
                                    Text("About/Help")
                                }.buttonStyle(PlainButtonStyle())
                                NavigationLink(destination: HowToPlayView()) {
                                    Text("How To Play")
                                }.buttonStyle(PlainButtonStyle())
                            }
                            Section {
                                Button(action: {
                                    self.showingAlert = true
                                }) {
                                    Text("Reset Graph Game")
                                }
                            }
                        }
                        .navigationBarTitle("Graph Settings")
                        .navigationBarItems(leading:
                            Button(action: {
                                self.viewModel.setSMA(index: self.SMAIndex)
                                self.viewModel.setAdvanceSpeed(speed: self.advanceSpeedIndex)
                                withAnimation {
                                    self.location = 4
                                }
                            }) {
                                Text("Back")
                            }
                        )
                    }
                    .alert(isPresented: $showingAlert) {
                        Alert(
                            title: Text("Are you sure?"),
                            message: Text("Are you sure you want to reset the graph game? All existing positions will be ended."),
                            primaryButton: .destructive(Text("Reset")) {
                                self.viewModel.resetGame()
                                self.SMAIndex = 0
                                self.advanceSpeedIndex = 1
                                self.location = 3
                            }, secondaryButton: .cancel()
                        )
                    }
                }
            )
        }
    }
    //MARK: Drawing Constants
    let isWide: Bool = UIScreen.main.bounds.width == 414.0
    let isTiny = UIScreen.main.bounds.height == 667.0 || UIScreen.main.bounds.height == 736.0
    let cornerRadius: CGFloat = 5
    let buttonOutlineColor: Double = 0.3
    let buttonOutlineWidth: CGFloat = 2
    let buttonColor: Double = 0.7
    let buttonSize: CGFloat = UIScreen.main.bounds.width == 414.0 ? 40 : 36
    let screenWidth: CGFloat = UIScreen.main.bounds.width
    
    let tradingHeight: CGFloat = UIScreen.main.bounds.height == 667.0 ? 30 : (UIScreen.main.bounds.height == 736.0 ? 35 : 51.1)
    let tradingFont: Font? = (UIScreen.main.bounds.height == 667.0 || UIScreen.main.bounds.height == 736.0) ? .system(size: 20) : .system(size: 34)
    let buyButtonWidth: CGFloat = UIScreen.main.bounds.width == 414.0 ? 98 : 88
    let buyButtonHeight: CGFloat = UIScreen.main.bounds.height == 667.0 ? 47 : (UIScreen.main.bounds.height == 736.0 ? 55 : 79)
    let shiftButtons: CGFloat = UIScreen.main.bounds.width == 414.0 ? -4 : -2
}

//MARK: StatView
struct StatView: View {
    var stat: Array<String>
    var advanced: Bool
    let isWide = UIScreen.main.bounds.width == 414.0
    
    var body: some View {
        if advanced {
            return AnyView (
                HStack(alignment: .top, spacing: 8) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Balance: ").lineLimit(1).font(isWide ? .system(size: 17) : .system(size: 14))
                        Text("% Change:").lineLimit(1).font(isWide ? .system(size: 17) : .system(size: 14))
                    }
                    Spacer()
                    VStack(alignment: .leading, spacing: 6) {
                        Text("$" + stat[1]).lineLimit(1).font(isWide ? .system(size: 17) : .system(size: 14))
                        ZStack {
                            RoundedRectangle(cornerRadius: 5, style: .continuous)
                                .fill(stat[4] == "+" ? Color.green : Color.red)
                                .frame(width: isWide ? 75 : 68, height: 25)
                            Text(stat[4] + stat[2] + "%").lineLimit(1).font(isWide ? .system(size: 17) : .system(size: 14))
                        }
                    }
                }
                .padding(.leading, 5)
                .padding(.trailing, 3)
                .padding(.bottom, 2)
            )
        } else {
            return AnyView(
                HStack {
                    Text("$" + stat[0])
                        .foregroundColor(stat[4] == "+" ? Color.green : Color.red)
                        .font(UIScreen.main.bounds.width == 414.0 ? .system(size: 34) : .system(size: 28)).fontWeight(.light)
                    Spacer()
                }
                .padding(.leading, 5)
                .padding(.trailing, 5)
            )
        }
    }
}

//MARK: SlotView
struct SlotView: View {
    var slot: StockModel<Array<String>>.Slot
    
    var body: some View {
        GeometryReader { geometry in
            self.body(for: geometry.size)
        }
    }
    
    @ViewBuilder private func body(for size: CGSize) -> some View {
        HStack(spacing: 15) {
            Group {
                if !slot.isAdvanced {
                    VStack(alignment: .leading, spacing: 3) {
                        Text(slot.content[0]) // 0 Ticker, 1 price, 2 daily%increase, 3 daily$increase, 4 , 5 shares, 6 personal$increase, 7 personal
                            .fontWeight(.bold)
                            .font(.system(size: 17))
                        Text("$" + slot.content[1])
                            .font(.system(size: 17))
                            .fixedSize(horizontal: true, vertical: false)
                    }
                    Spacer()
                    VStack(alignment: .leading, spacing: 3) {
                        Text(slot.content[8] + slot.content[2] + "%")
                            .font(.system(size: 17))
                        Text(slot.content[8] + "$" + slot.content[3])
                            .font(.system(size: 17))
                            .fixedSize(horizontal: true, vertical: false)
                    }
                    VStack(alignment: .leading, spacing: 3) {
                        Text(slot.content[4])
                            .font(.system(size: 17))
                        Text(slot.content[5] + " Share" + (Int(slot.content[5])! == 1 ? " " : "s"))
                            .font(.system(size: 17))
                            .fixedSize(horizontal: true, vertical: false)
                    }
                    ZStack {
                        RoundedRectangle(cornerRadius: 6, style: .continuous)
                            .fill((slot.content[7] == "+") ? Color.green : Color.red)
                            .frame(width: 82, height: 30)
                        Text(slot.content[7] + "$" + slot.content[6])
                            .font(.system(size: 17))
                    }
                } else {
                    VStack(alignment: .leading, spacing: 3) {
                        Text("Purchased at: $" + slot.content[9][slot.content[9].startIndex..<slot.content[9].index(slot.content[9].endIndex, offsetBy: -3)] + "." + slot.content[9][slot.content[9].index(slot.content[9].endIndex, offsetBy: -2)..<slot.content[9].endIndex])
                            .font(.system(size: 17))
                        Text("Purchase date: " + slot.content[11])
                            .fixedSize(horizontal: false, vertical: false)
                            .font(.system(size: 17))
                    }
                    Spacer()
                    ZStack {
                        RoundedRectangle(cornerRadius: 6, style: .continuous)
                            .fill((slot.content[7] == "+") ? Color.green : Color.red)
                            .frame(width: 82, height: 30)
                        Text(slot.content[7] + slot.content[12] + "%")
                            .font(.system(size: 17))
                    }
                }
            }
        }
    }
}

//MARK: StockStatView
struct StockStatView: View {
    var advanced: Bool
    var stats: Dictionary<String, String>
    
    var body: some View {
        
        if !advanced {
            return AnyView (
                HStack {
                    Text("$" + stats["Net Worth"]!)
                        .foregroundColor(Color.green)
                        .font(.system(size: 34)).fontWeight(.light)
                    Spacer()
                }
            )
        } else {
            return AnyView (
                HStack {
                    Text("$" + stats["Cash On Hand"]!)
                        .foregroundColor(Color.green)
                        .font(.system(size: 34)).fontWeight(.light)
                    Spacer()
                }
            )
        }
    }
}

//MARK: GraphView
struct GraphView: View {
    var graph: GraphModel.Graph
    var tradeIndicators: Array<GraphModel.TradeIndicator>
    var hasProfited: String
    let lineSeparation: CGFloat = (UIScreen.main.bounds.width - 50) / 60
    let isWide = UIScreen.main.bounds.width == 414.0
    
    var body: some View {
        ZStack(alignment: .bottom) {
            Rectangle()
                .fill(Color.gray)
                .opacity(0.7) // Using Opacity to automatically change the color of the background based on light/dark mode
                .frame(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.width - 15)
            HStack(spacing: 0) {
                VStack {
                    Path { path in
                        path.move(to: CGPoint(x: Int(lineSeparation), y: graph.graphHeight + 5))
                        path.addLine(to: CGPoint(x: lineSeparation, y: CGFloat(graph.points[0].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 2, y: CGFloat(graph.points[1].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 3, y: CGFloat(graph.points[2].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 4, y: CGFloat(graph.points[3].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 5, y: CGFloat(graph.points[4].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 6, y: CGFloat(graph.points[5].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 7, y: CGFloat(graph.points[6].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 8, y: CGFloat(graph.points[7].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 9, y: CGFloat(graph.points[8].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 10, y: CGFloat(graph.points[9].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 11, y: CGFloat(graph.points[10].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 12, y: CGFloat(graph.points[11].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 13, y: CGFloat(graph.points[12].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 14, y: CGFloat(graph.points[13].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 15, y: CGFloat(graph.points[14].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 16, y: CGFloat(graph.points[15].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 17, y: CGFloat(graph.points[16].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 18, y: CGFloat(graph.points[17].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 19, y: CGFloat(graph.points[18].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 20, y: CGFloat(graph.points[19].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 21, y: CGFloat(graph.points[20].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 22, y: CGFloat(graph.points[21].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 23, y: CGFloat(graph.points[22].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 24, y: CGFloat(graph.points[23].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 25, y: CGFloat(graph.points[24].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 26, y: CGFloat(graph.points[25].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 27, y: CGFloat(graph.points[26].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 28, y: CGFloat(graph.points[27].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 29, y: CGFloat(graph.points[28].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 30, y: CGFloat(graph.points[29].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 31, y: CGFloat(graph.points[30].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 32, y: CGFloat(graph.points[31].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 33, y: CGFloat(graph.points[32].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 34, y: CGFloat(graph.points[33].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 35, y: CGFloat(graph.points[34].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 36, y: CGFloat(graph.points[35].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 37, y: CGFloat(graph.points[36].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 38, y: CGFloat(graph.points[37].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 39, y: CGFloat(graph.points[38].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 40, y: CGFloat(graph.points[39].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 41, y: CGFloat(graph.points[40].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 42, y: CGFloat(graph.points[41].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 43, y: CGFloat(graph.points[42].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 44, y: CGFloat(graph.points[43].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 45, y: CGFloat(graph.points[44].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 46, y: CGFloat(graph.points[45].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 47, y: CGFloat(graph.points[46].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 48, y: CGFloat(graph.points[47].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 49, y: CGFloat(graph.points[48].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 50, y: CGFloat(graph.points[49].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 51, y: CGFloat(graph.points[50].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 52, y: CGFloat(graph.points[51].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 53, y: CGFloat(graph.points[52].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 54, y: CGFloat(graph.points[53].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 55, y: CGFloat(graph.points[54].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 56, y: CGFloat(graph.points[55].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 57, y: CGFloat(graph.points[56].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 58, y: CGFloat(graph.points[57].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 59, y: CGFloat(graph.points[58].point)))
                        path.addLine(to: CGPoint(x: lineSeparation * 60, y: CGFloat(graph.points[59].point)))
                        
                        path.addLine(to: CGPoint(x: Int(lineSeparation) * (isWide ? 61 : 65), y: graph.graphHeight + 5))
                    }
                    .fill(hasProfited == "+" ? Color(red: 0.4, green: 0.7, blue: 0.4) : Color(red: 0.7, green: 0.4, blue: 0.4))
                    .offset(x: -6, y: 15)
                    HStack(spacing: lineSeparation + 3.6) {
                        ForEach(0..<31) { _ in
                            Rectangle() //Stupidest fix: cannot be 0...60
                                .frame(width: 2, height: 5)
                        }
                        .offset(x: -15, y: -1)
                    }
                }
                CompilerSucksView(graph: graph)
            }
            if graph.isSMAOn {
                Path { path in
                    path.move(to: CGPoint(x: Int(lineSeparation), y: graph.graphHeight + 5))
                    path.addLine(to: CGPoint(x: lineSeparation, y: CGFloat(graph.simpleMovingAverage[0].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 2, y: CGFloat(graph.simpleMovingAverage[1].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 3, y: CGFloat(graph.simpleMovingAverage[2].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 4, y: CGFloat(graph.simpleMovingAverage[3].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 5, y: CGFloat(graph.simpleMovingAverage[4].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 6, y: CGFloat(graph.simpleMovingAverage[5].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 7, y: CGFloat(graph.simpleMovingAverage[6].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 8, y: CGFloat(graph.simpleMovingAverage[7].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 9, y: CGFloat(graph.simpleMovingAverage[8].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 10, y: CGFloat(graph.simpleMovingAverage[9].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 11, y: CGFloat(graph.simpleMovingAverage[10].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 12, y: CGFloat(graph.simpleMovingAverage[11].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 13, y: CGFloat(graph.simpleMovingAverage[12].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 14, y: CGFloat(graph.simpleMovingAverage[13].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 15, y: CGFloat(graph.simpleMovingAverage[14].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 16, y: CGFloat(graph.simpleMovingAverage[15].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 17, y: CGFloat(graph.simpleMovingAverage[16].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 18, y: CGFloat(graph.simpleMovingAverage[17].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 19, y: CGFloat(graph.simpleMovingAverage[18].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 20, y: CGFloat(graph.simpleMovingAverage[19].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 21, y: CGFloat(graph.simpleMovingAverage[20].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 22, y: CGFloat(graph.simpleMovingAverage[21].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 23, y: CGFloat(graph.simpleMovingAverage[22].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 24, y: CGFloat(graph.simpleMovingAverage[23].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 25, y: CGFloat(graph.simpleMovingAverage[24].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 26, y: CGFloat(graph.simpleMovingAverage[25].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 27, y: CGFloat(graph.simpleMovingAverage[26].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 28, y: CGFloat(graph.simpleMovingAverage[27].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 29, y: CGFloat(graph.simpleMovingAverage[28].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 30, y: CGFloat(graph.simpleMovingAverage[29].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 31, y: CGFloat(graph.simpleMovingAverage[30].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 32, y: CGFloat(graph.simpleMovingAverage[31].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 33, y: CGFloat(graph.simpleMovingAverage[32].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 34, y: CGFloat(graph.simpleMovingAverage[33].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 35, y: CGFloat(graph.simpleMovingAverage[34].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 36, y: CGFloat(graph.simpleMovingAverage[35].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 37, y: CGFloat(graph.simpleMovingAverage[36].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 38, y: CGFloat(graph.simpleMovingAverage[37].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 39, y: CGFloat(graph.simpleMovingAverage[38].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 40, y: CGFloat(graph.simpleMovingAverage[39].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 41, y: CGFloat(graph.simpleMovingAverage[40].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 42, y: CGFloat(graph.simpleMovingAverage[41].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 43, y: CGFloat(graph.simpleMovingAverage[42].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 44, y: CGFloat(graph.simpleMovingAverage[43].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 45, y: CGFloat(graph.simpleMovingAverage[44].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 46, y: CGFloat(graph.simpleMovingAverage[45].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 47, y: CGFloat(graph.simpleMovingAverage[46].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 48, y: CGFloat(graph.simpleMovingAverage[47].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 49, y: CGFloat(graph.simpleMovingAverage[48].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 50, y: CGFloat(graph.simpleMovingAverage[49].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 51, y: CGFloat(graph.simpleMovingAverage[50].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 52, y: CGFloat(graph.simpleMovingAverage[51].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 53, y: CGFloat(graph.simpleMovingAverage[52].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 54, y: CGFloat(graph.simpleMovingAverage[53].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 55, y: CGFloat(graph.simpleMovingAverage[54].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 56, y: CGFloat(graph.simpleMovingAverage[55].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 57, y: CGFloat(graph.simpleMovingAverage[56].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 58, y: CGFloat(graph.simpleMovingAverage[57].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 59, y: CGFloat(graph.simpleMovingAverage[58].point)))
                    path.addLine(to: CGPoint(x: lineSeparation * 60, y: CGFloat(graph.simpleMovingAverage[59].point)))
                    
                    path.addLine(to: CGPoint(x: Int(lineSeparation) * (isWide ? 61 : 65), y: graph.graphHeight + 5))
                }
                .fill(Color.blue)
                .offset(x: -6, y: 15)
                .opacity(0.2)
                
            }
            ForEach(tradeIndicators) { trade in
                Rectangle()
                    .fill(Color.black)
                    .frame(width: 3, height: CGFloat(self.graph.graphHeight) + 1)
                    .offset(x: self.lineSeparation * CGFloat(trade.day) * -1 + (self.isWide ? 150 : 130), y: -10)
            }
        }
    }
}

struct CompilerSucksView: View {
    var graph: GraphModel.Graph
    let isWide = UIScreen.main.bounds.width == 414.0
    
    var body: some View {
        ZStack {
            ForEach(graph.helpers) { help in
                Text(String(help.point)).font(.system(size: 12))
                    .offset(x: -10, y: -1 * CGFloat(help.id * (Int(UIScreen.main.bounds.width - 45) / self.graph.helperCount)))
                    .offset(y: self.isWide ? 180 : 165)
            }
        }
    }
}

//MARK: StockInfoView
struct StockInfoView: View {
    var stats: Dictionary<String, String>
    let isWide = UIScreen.main.bounds.width == 414.0
    let isTall = UIScreen.main.bounds.height == 896.0
    let isTiny = UIScreen.main.bounds.height == 667.0 || UIScreen.main.bounds.height == 736.0
    let font: Font? = UIScreen.main.bounds.width == 414.0 ? .system(size: 17) : .system(size: 16)
    let boxWidth: CGFloat = UIScreen.main.bounds.width == 414.0 ? 82 : 77
    let boxHeight: CGFloat = UIScreen.main.bounds.height == 896.0 ? 30 : 27
    
    var body: some View {
        GeometryReader { geometry in
            self.body(for: geometry.size)
        }
    }
    
    @ViewBuilder private func body(for size: CGSize) -> some View {
        ZStack {
            Rectangle()
                .fill(Color.gray)
                .edgesIgnoringSafeArea(.bottom)
                .opacity(0.7)
            VStack {
                ZStack {
                    Rectangle()
                        .fill(Color.gray)
                        .opacity(0.5)
                        .frame(height: isTall ? 60 : 50)
                    HStack {
                        Text("$" + stats["Price"]!).font(isTall ? .system(size: 28) : .system(size: 20)).fontWeight(isTall ? .light : .semibold)
                        Spacer()
                        Text(stats["Long or Short"]!).fontWeight(.semibold).font(.system(size: 17))
                    }
                    .padding(.leading, 25)
                    .padding(.trailing, 55)
                }
                if isTiny {
                    Spacer()
                }
                HStack {
                    VStack(alignment: .leading, spacing: isTall ? 60 : 46) {
                        VStack(alignment: .leading, spacing: 20) {
                            Text("Daily Change:").fontWeight(.semibold).font(font)
                            Text("$ Change:").fontWeight(.semibold).font(font)
                            Text("% Change:").fontWeight(.semibold).font(font)
                        }
                        if !isTiny {
                            VStack(alignment: .leading, spacing: 10) {
                                Text("Buy Price:").fontWeight(.semibold).font(font)
                                Text("Bought:").fontWeight(.semibold).font(font)
                            }
                        }
                    }
                    Spacer()
                    VStack(spacing: isTall ? 60 : 46) {
                        VStack(spacing: 10) {
                            ZStack {
                                RoundedRectangle(cornerRadius: 6, style: .continuous)
                                    .fill(stats["Increase or Decrease"] == "+" ? Color.green : Color.red)
                                    .frame(width: boxWidth, height: boxHeight)
                                Text(stats["Increase or Decrease"]! + "$" + stats["Daily Change"]!).font(font)
                            }
                            ZStack {
                                RoundedRectangle(cornerRadius: 6, style: .continuous)
                                    .fill(stats["Total Increase or Decrease"] == "+" ? Color.green : Color.red)
                                    .frame(width: boxWidth, height: boxHeight)
                                Text(stats["Total Increase or Decrease"]! + "$" + stats["$ Change"]!).font(font)
                            }
                            ZStack {
                                RoundedRectangle(cornerRadius: 6, style: .continuous)
                                    .fill(stats["Total Increase or Decrease"] == "+" ? Color.green : Color.red)
                                    .frame(width: boxWidth, height: boxHeight)
                                Text(stats["% Change"]! + "%").font(font)
                            }
                        }
                        if !isTiny {
                            VStack(spacing: 10) {
                                Text("$" + stats["Buy Price"]!).font(font)
                                Text(stats["Day Bought"]! + " Days Ago").font(font)
                            }
                        }
                    }
                }
                .frame(width: 250)
                .offset(y: isTiny ? -15 : 0)
                .padding(15)
                .padding(.trailing, 5)
            }
        }
    }
}

//MARK: Other Views
struct AboutView: View {
    var body: some View {
        VStack(spacing: 12) {
            Text("About")
                .fontWeight(.bold).font(.system(size: 28))
            Text("""
                StockUp Game was created by Cade Harger. All market information is retrieved from Yahoo Finance and Google Finance.
            """).font(.system(size: 18)).multilineTextAlignment(.leading)
            Rectangle()
                .fill(Color.white)
                .frame(height: 15)
            Text("""
                Questions, Comments, or Suggestions?
            """)
                .fontWeight(.bold).font(.system(size: 28)).multilineTextAlignment(.center)
            Text("""
                Please comment on my blog or contact me at the email on my blog at stockupgame.weebly.com
            """).font(.system(size: 18)).multilineTextAlignment(.leading)
            Spacer()
            Image("Logo")
            Text("StockUp Game Version 1.03 (6)").font(.system(size: 18))
        }
        .frame(width: 380)
    }
}

struct HowToPlayView: View {
    var body: some View {
        VStack(spacing: 12) {
            Text("How To Play")
                .fontWeight(.bold).font(.system(size: 28))
            Text("""
                In this game, you are given a graph of a real stock for 60 days from some point in the past. You can press the \"Go\" button to simulate days passing. You can buy or short sell stocks based on a percentage that you choose of the balance in your account.
            """).font(.system(size: 18)).multilineTextAlignment(.leading)
            Text("""
                This part of the app was designed to teach people how to read and predict stock market prices from graphs. The \"Next\" button allows you to move to a different stock if desired.
            """).font(.system(size: 18)).multilineTextAlignment(.leading)
            Rectangle()
                .opacity(0.0)
                .frame(height: 15)
            Text("Buying / Selling")
                .fontWeight(.bold).font(.system(size: 28))
            Text("""
                In order to make a trade on the stock that appears on the graph, press the \"Buy\" button or the \"Sell\" button, depending on whether you would like to buy or short sell the stock. You may choose to buy/sell more of a stock buy if necessary.
            """).font(.system(size: 18)).multilineTextAlignment(.leading)
            Text("""
                In order to end your position, you must buy back the shares you short sold or sell the shares you bought. When ending a position, the percentage you choose is the percentage of your position that you are choosing to end.
            """)
            Spacer()
        }
        .frame(width: 370)
    }
}
