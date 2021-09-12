
export interface Caching {
    getData(key: string): Promise<any>
    setData(key: string, value: string, expirtationTimeInSeconds?: number): Promise<string>
}
